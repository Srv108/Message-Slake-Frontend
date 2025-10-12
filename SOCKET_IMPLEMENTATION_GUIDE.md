# Socket Implementation Guide - Persistent Connection Architecture

## 🎯 Overview

This document describes the **robust, persistent socket connection architecture** implemented in the MessageSlake frontend application. The system ensures reliable real-time communication with proper state management, automatic reconnection, and data consistency.

## 🏗️ Architecture Principles

### 1. **Single Persistent Socket Connection**
- Socket is created **once** when the app loads (if user is authenticated and online)
- Socket persists across component re-renders and route changes
- Socket is only destroyed on logout or app closure

### 2. **Network-Aware Initialization**
- Checks internet connectivity before creating socket
- Monitors network status changes
- Automatically cleans up on offline, reconnects on online

### 3. **Data Consistency**
- Clears all message lists when:
  - Going offline
  - Logging out
  - Switching rooms/channels
  - Reconnecting (for fresh data)

### 4. **Smart Room/Channel Joining**
- Only joins when socket is ready
- Prevents duplicate joins
- Tracks current room/channel in context
- Rejoins automatically after reconnection

## 📋 Implementation Flow

### App Initialization

```
User Opens App
    ↓
Check Authentication
    ↓
Check Network Status (navigator.onLine)
    ↓
If Online & Authenticated:
    ↓
Create Socket Connection
    ↓
Store Socket in Ref (persistent)
    ↓
Setup Event Listeners
    ↓
Wait for 'connect' event
    ↓
Socket Ready (isSocketReady = true)
    ↓
Store Socket ID
    ↓
Join Personal Notification Room
```

### Room/Channel Navigation

```
User Clicks on Room/Channel
    ↓
Component Mounts
    ↓
Clear Old Messages
    ↓
Check if Socket Ready
    ↓
If Ready:
    ↓
Check if Already in Room/Channel
    ↓
If Not:
    ↓
Emit joinRoom/JoinChannel
    ↓
Update Context State
    ↓
Fetch Initial Messages from API
    ↓
Load Messages Once
    ↓
Listen for Real-time Messages
```

### Reconnection Flow

```
Socket Disconnects
    ↓
Set isSocketReady = false
    ↓
Socket.io Attempts Reconnection (5 attempts)
    ↓
On Successful Reconnect:
    ↓
Clear All Message Lists
    ↓
Set isSocketReady = true
    ↓
Update Socket ID
    ↓
Rejoin Current Room/Channel (if exists)
    ↓
Fetch Fresh Messages
```

## 🔧 Key Components

### 1. SocketContext (`/src/context/SocketContex.jsx`)

**State Management:**
```javascript
const [isSocketReady, setIsSocketReady] = useState(false)
const [socketInstance, setSocketInstance] = useState(null)
const [isOnline, setIsOnline] = useState(navigator.onLine)
const [socketId, setSocketId] = useState(null)
const [currentChannel, setCurrentChannel] = useState(null)
const [currentRoom, setCurrentRoom] = useState(null)
```

**Refs:**
```javascript
const socketRef = useRef(null)              // Persistent socket instance
const messageHandlersSetup = useRef(false)  // Track if handlers are setup
const isInitializing = useRef(false)        // Prevent multiple initializations
const hasInitializedOnce = useRef(false)    // Track first initialization
```

**Key Functions:**
- `joinRoom(roomId)` - Join a one-to-one chat room
- `joinChannel(channelId)` - Join a group channel

### 2. Room Component (`/src/pages/Room/Room.jsx`)

**Responsibilities:**
- Clear messages when roomId changes
- Join room via socket when ready
- Load initial messages once
- Listen for real-time messages

**Key Logic:**
```javascript
// Clear messages on room change
useEffect(() => {
    setRoomMessageList([])
    hasLoadedMessages.current = false
    queryClient.invalidateQueries(['fetchRoomMessages', roomId])
}, [roomId])

// Join room when socket is ready
useEffect(() => {
    if (roomId && isSocketReady && socketCurrentRoom !== roomId) {
        joinRoom(roomId)
    }
}, [roomId, isSocketReady, socketCurrentRoom, joinRoom])

// Load initial messages once
useEffect(() => {
    if (isSuccess && RoomMessageDetails && !hasLoadedMessages.current) {
        setRoomMessageList(RoomMessageDetails)
        hasLoadedMessages.current = true
    }
}, [isSuccess, RoomMessageDetails])
```

### 3. Channel Component (`/src/pages/Workspace/Channel/Channel.jsx`)

Same pattern as Room component, but for channels.

## 📡 Socket Events

### Connection Events

| Event | When | Action |
|-------|------|--------|
| `connect` | Socket connects | Set ready, store ID, join personal room |
| `disconnect` | Socket disconnects | Set not ready, clear ID |
| `reconnect` | Socket reconnects | Clear messages, rejoin rooms, fetch fresh data |
| `connect_error` | Connection fails | Log error, set not ready |
| `reconnect_failed` | All attempts fail | Log error, notify user |

### Message Events

#### One-to-One Chat
- `roomMessageRecieved` - Receive optimistic message
- `roomMessageSent` - Sender confirmation
- `roomMessageConfirmed` - DB save confirmed
- `roomMessageFailed` - Message failed

#### Group/Channel Chat
- `NewMessageReceived` - Receive optimistic message
- `channelMessageSent` - Sender confirmation
- `channelMessageConfirmed` - DB save confirmed
- `channelMessageFailed` - Message failed

## 🛡️ Safety Mechanisms

### 1. **Prevent Multiple Socket Creation**
```javascript
if (isInitializing.current) {
    console.log('⏳ Socket initialization already in progress...')
    return
}

if (!socketRef.current) {
    isInitializing.current = true
    // Create socket...
}
```

### 2. **Network Status Monitoring**
```javascript
useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => {
        setIsOnline(false)
        setMessageList([])
        setRoomMessageList([])
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
}, [])
```

### 3. **Cleanup on Logout**
```javascript
if (!auth?.token && socketRef.current) {
    socketRef.current.removeAllListeners()
    socketRef.current.disconnect()
    socketRef.current = null
    setMessageList([])
    setRoomMessageList([])
    setCurrentChannel(null)
    setCurrentRoom(null)
}
```

### 4. **Prevent Duplicate Joins**
```javascript
if (roomId === currentRoom) {
    console.log('ℹ️ Already in room:', roomId)
    return
}
```

### 5. **Queue Joins When Socket Not Ready**
```javascript
if (!isSocketReady) {
    socketRef.current.once('connect', () => {
        socketRef.current.emit('joinRoom', { roomId }, callback)
    })
    return
}
```

## 📊 State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    SocketContext                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  socketRef.current (Persistent Socket Instance)        │ │
│  │  - Created once on app load                            │ │
│  │  - Survives component re-renders                       │ │
│  │  - Only destroyed on logout                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  State:                                                       │
│  - isSocketReady: boolean                                    │
│  - socketId: string | null                                   │
│  - isOnline: boolean                                         │
│  - currentRoom: string | null                                │
│  - currentChannel: string | null                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Provides
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Components                                │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │     Room     │         │   Channel    │                 │
│  │              │         │              │                 │
│  │ - Joins room │         │ - Joins chan │                 │
│  │ - Loads msgs │         │ - Loads msgs │                 │
│  │ - Listens    │         │ - Listens    │                 │
│  └──────────────┘         └──────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Best Practices

### 1. **Always Check Socket Ready**
```javascript
if (!isSocketReady) {
    console.warn('Socket not ready')
    return
}
```

### 2. **Clear Messages on Navigation**
```javascript
useEffect(() => {
    setMessageList([])
    hasLoadedMessages.current = false
}, [roomId])
```

### 3. **Load Initial Messages Once**
```javascript
const hasLoadedMessages = useRef(false)

useEffect(() => {
    if (isSuccess && messages && !hasLoadedMessages.current) {
        setMessageList(messages)
        hasLoadedMessages.current = true
    }
}, [isSuccess, messages])
```

### 4. **Use Context State for Current Room/Channel**
```javascript
const { currentRoom, currentChannel } = useSocket()

// Don't maintain separate state in components
```

### 5. **Handle Callbacks**
```javascript
socket.emit('joinRoom', { roomId }, (response) => {
    if (response?.success) {
        console.log('✅ Joined successfully')
    } else {
        console.error('❌ Failed to join')
    }
})
```

## 🐛 Debugging

### Check Socket Status
```javascript
const { socket, isSocketReady, socketId, isOnline } = useSocket()

console.log('Socket Ready:', isSocketReady)
console.log('Socket ID:', socketId)
console.log('Online:', isOnline)
console.log('Connected:', socket?.connected)
```

### Monitor Logs
All socket operations are logged with clear prefixes:
- `🚀 INITIALIZING SOCKET CONNECTION`
- `🎉 SOCKET CONNECTED`
- `⚠️ SOCKET DISCONNECTED`
- `🔄 SOCKET RECONNECTED`
- `🚪 JOINING ROOM/CHANNEL`
- `🧹 Clearing messages`

### Common Issues

**Issue: Messages not received**
- Check `isSocketReady` is true
- Verify room/channel was joined
- Check network connectivity

**Issue: Duplicate messages**
- Ensure `hasLoadedMessages` ref is used
- Check for duplicate event listeners

**Issue: Socket not connecting**
- Check auth token is valid
- Verify network is online
- Check backend URL is correct

## 📝 Summary

### What This Architecture Provides

✅ **Single persistent socket** - No reconnection on every route change
✅ **Network-aware** - Handles offline/online gracefully
✅ **Data consistency** - Clears stale data automatically
✅ **Smart joining** - Only joins when ready, prevents duplicates
✅ **Automatic reconnection** - Rejoins rooms after disconnect
✅ **Clean state management** - Context tracks current room/channel
✅ **Comprehensive logging** - Easy debugging
✅ **Error handling** - Graceful degradation

### Key Takeaways

1. **Socket is created once** when app loads (if authenticated & online)
2. **Messages are cleared** when switching rooms/channels
3. **Rooms/channels are joined** only when socket is ready
4. **Reconnection** automatically rejoins current room/channel
5. **Network status** is monitored and handled
6. **State is centralized** in SocketContext

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-12  
**Status:** Production Ready ✅
