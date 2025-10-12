# Socket Events Reference - Complete Frontend Implementation Guide

## Table of Contents
1. [Connection & Authentication](#connection--authentication)
2. [One-to-One Chat (Rooms)](#one-to-one-chat-rooms)
3. [Group/Channel Chat](#groupchannel-chat)
4. [WebRTC Signaling](#webrtc-signaling-videoaudio-calls)
5. [Multi-Device Login Events](#multi-device-login-events)
6. [Message Object Structure](#message-object-structure)
7. [Client Implementation Examples](#client-implementation-examples)

---

## Connection & Authentication

### Initial Connection
```javascript
import io from 'socket.io-client'

const socket = io('http://localhost:3000', {
    auth: {
        token: 'your-jwt-token'  // Required for authentication
    },
    transports: ['websocket', 'polling']
})

socket.on('connect', () => {
    console.log('Connected:', socket.id)
})

socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason)
})
```

### Reconnection Event
**`reconnected`** - Automatic reconnection with room restoration
```javascript
socket.on('reconnected', ({ message, rooms, previousSocketId }) => {
    console.log('Reconnected! Previous rooms restored:', rooms)
    // All previous rooms are automatically rejoined
    // No need to manually rejoin
})
```

---

## Quick Event Guide

### One-to-One Chat (Rooms)

#### Client → Server

**`roomMessage`** - Send a message in a room
```javascript
socket.emit('roomMessage', {
    roomId: '507f1f77bcf86cd799439011',
    senderId: '507f1f77bcf86cd799439012',
    body: 'Hello!',
    image: 'https://...',  // optional
    filename: 'photo.jpg', // optional
    timeStamp: 1234567890  // optional
}, (response) => {
    console.log(response.data)
})
```

**`joinRoom`** - Join a room to receive messages
```javascript
socket.emit('joinRoom', {
    roomId: '507f1f77bcf86cd799439011'
}, (response) => {
    console.log(`Joined room with ${response.data.connectedUsers} users`)
})
```

**`leaveRoom`** - Leave a room
```javascript
socket.emit('leaveRoom', {
    roomId: '507f1f77bcf86cd799439011'
})
```

#### Server → Client

**`roomMessageRecieved`** - Receive message (instant, optimistic)
```javascript
socket.on('roomMessageRecieved', (message) => {
    // message.isOptimistic === true
    // message._id starts with 'temp_'
    displayMessage(message)
})
```

**`roomMessageSent`** - Confirmation to sender
```javascript
socket.on('roomMessageSent', (message) => {
    // Your message was sent
    markAsSending(message)
})
```

**`roomMessageConfirmed`** - DB save confirmed
```javascript
socket.on('roomMessageConfirmed', (message) => {
    // message.tempId - original temp ID
    // message._id - real DB ID
    // message.isConfirmed === true
    replaceMessage(message.tempId, message)
})
```

**`roomMessageFailed`** - Message failed to save
```javascript
socket.on('roomMessageFailed', ({ tempId, error }) => {
    removeMessage(tempId)
    showError(error)
})
```

---

### Group/Channel Chat

#### Client → Server

**`NewMessage`** - Send a message in a channel
```javascript
socket.emit('NewMessage', {
    channelId: '507f1f77bcf86cd799439011',
    workspaceId: '507f1f77bcf86cd799439013',
    senderId: '507f1f77bcf86cd799439012',
    body: 'Hello team!',
    image: 'https://...'  // optional
}, (response) => {
    console.log(response.data)
})
```

**`JoinChannel`** - Join a channel to receive messages
```javascript
socket.emit('JoinChannel', {
    channelId: '507f1f77bcf86cd799439011'
}, (response) => {
    console.log(`Joined channel with ${response.data.connectedUsers} users`)
})
```

**`LeaveChannel`** - Leave a channel
```javascript
socket.emit('LeaveChannel', {
    channelId: '507f1f77bcf86cd799439011'
})
```

#### Server → Client

**`NewMessageReceived`** - Receive message (instant, optimistic)
```javascript
socket.on('NewMessageReceived', (message) => {
    // message.isOptimistic === true
    // message._id starts with 'temp_'
    displayMessage(message)
})
```

**`channelMessageSent`** - Confirmation to sender
```javascript
socket.on('channelMessageSent', (message) => {
    markAsSending(message)
})
```

**`channelMessageConfirmed`** - DB save confirmed
```javascript
socket.on('channelMessageConfirmed', (message) => {
    // message.tempId - original temp ID
    // message._id - real DB ID
    replaceMessage(message.tempId, message)
})
```

**`channelMessageFailed`** - Message failed to save
```javascript
socket.on('channelMessageFailed', ({ tempId, error }) => {
    removeMessage(tempId)
    showError(error)
})
```

---

### WebRTC Signaling (Video/Audio Calls)

#### Client → Server

**`offer`** - Send WebRTC offer
```javascript
socket.emit('offer', {
    from: { email: 'user@example.com' },
    to: { 
        room: 'call-room-id',
        user: { username: 'john', id: '123' }
    },
    offer: rtcOffer
}, (response) => {
    console.log('Offer sent')
})
```

**`answer`** - Send WebRTC answer
```javascript
socket.emit('answer', {
    answer: rtcAnswer,
    from: 'user@example.com',
    to: { room: 'call-room-id' }
}, (response) => {
    console.log('Answer sent')
})
```

**`ice-candidate`** - Send ICE candidate
```javascript
socket.emit('ice-candidate', {
    from: { email: 'user@example.com' },
    to: { room: 'call-room-id' },
    candidate: iceCandidate
}, (response) => {
    console.log('Candidate sent')
})
```

#### Server → Client

**`IncomingCallNotification`** - Incoming call
```javascript
socket.on('IncomingCallNotification', ({ offer, from, to }) => {
    showIncomingCallUI(from)
})
```

**`newAnswer`** - Received answer
```javascript
socket.on('newAnswer', ({ answer, from }) => {
    handleAnswer(answer)
})
```

**`newIce-candidate`** - Received ICE candidate
```javascript
socket.on('newIce-candidate', ({ candidate, from }) => {
    addIceCandidate(candidate)
})
```

---

## Multi-Device Login Events

### Server → Client

**`accountLoggedInElsewhere`** - Notifies previous device about new login
```javascript
socket.on('accountLoggedInElsewhere', (data) => {
    // data = {
    //   message: 'Someone logged into your account from another device',
    //   newSocketId: '<new-socket-id>',
    //   userId: '<user-id>',
    //   timestamp: '2025-10-12T04:00:00.000Z'
    // }
    
    // Show notification to user
    showNotification('Your account was logged in from another device')
    
    // Store device info for session management
    addLoggedInDevice({
        socketId: data.newSocketId,
        timestamp: data.timestamp
    })
    
    // Optional: Force logout or show warning
    // forceLogout()
})
```

**`accountAlreadyLoggedIn`** - Notifies new device about existing login
```javascript
socket.on('accountAlreadyLoggedIn', (data) => {
    // data = {
    //   message: 'This account is already logged in from another device',
    //   previousSocketId: '<old-socket-id>',
    //   userId: '<user-id>',
    //   timestamp: '2025-10-12T04:00:00.000Z'
    // }
    
    // Show notification to user
    showNotification('This account is logged in on another device')
    
    // Store existing device info
    addLoggedInDevice({
        socketId: data.previousSocketId,
        timestamp: data.timestamp
    })
})
```

### Implementation Example
```javascript
const [loggedInDevices, setLoggedInDevices] = useState([])

useEffect(() => {
    // Listen for multi-device login events
    socket.on('accountLoggedInElsewhere', (data) => {
        setLoggedInDevices(prev => [...prev, {
            socketId: data.newSocketId,
            timestamp: data.timestamp,
            type: 'new_device'
        }])
        
        // Show toast notification
        toast.warning('Your account was accessed from another device')
    })
    
    socket.on('accountAlreadyLoggedIn', (data) => {
        setLoggedInDevices(prev => [...prev, {
            socketId: data.previousSocketId,
            timestamp: data.timestamp,
            type: 'existing_device'
        }])
        
        toast.info('This account is logged in on another device')
    })
    
    return () => {
        socket.off('accountLoggedInElsewhere')
        socket.off('accountAlreadyLoggedIn')
    }
}, [socket])
```

---

## Message Object Structure

### Optimistic Message (Instant Delivery)
```javascript
{
    _id: 'temp_1234567890_abc123',  // Temporary ID
    body: 'Hello!',
    image: 'https://...',
    imageKey: 'photo-123-key',
    status: 'unread',
    roomId: '507f1f77bcf86cd799439011',  // or channelId
    senderId: {
        _id: '507f1f77bcf86cd799439012',
        username: 'john',
        email: 'john@example.com'
    },
    createdAt: '2025-10-09T03:49:24.000Z',
    updatedAt: '2025-10-09T03:49:24.000Z',
    isOptimistic: true  // Flag indicating temporary message
}
```

### Confirmed Message (After DB Save)
```javascript
{
    _id: '507f1f77bcf86cd799439014',  // Real MongoDB ID
    tempId: 'temp_1234567890_abc123',  // Original temp ID
    body: 'Hello!',
    image: 'https://...',
    imageKey: 'photo-123-key',
    status: 'unread',
    roomId: {
        _id: '507f1f77bcf86cd799439011',
        // ... populated room data
    },
    senderId: {
        _id: '507f1f77bcf86cd799439012',
        username: 'john',
        email: 'john@example.com',
        // ... full user data
    },
    createdAt: '2025-10-09T03:49:24.123Z',
    updatedAt: '2025-10-09T03:49:24.123Z',
    isConfirmed: true  // Flag indicating DB confirmation
}
```

---

## Client Implementation Examples

### React Example

```javascript
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

function Chat({ roomId, userId }) {
    const [messages, setMessages] = useState([])
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const newSocket = io('http://localhost:3000', {
            auth: { token: 'your-jwt-token' }
        })

        // Join room
        newSocket.emit('joinRoom', { roomId })

        // Receive optimistic messages
        newSocket.on('roomMessageRecieved', (message) => {
            setMessages(prev => [...prev, message])
        })

        // Replace with confirmed message
        newSocket.on('roomMessageConfirmed', (message) => {
            setMessages(prev => prev.map(msg => 
                msg._id === message.tempId ? message : msg
            ))
        })

        // Handle failures
        newSocket.on('roomMessageFailed', ({ tempId, error }) => {
            setMessages(prev => prev.filter(msg => msg._id !== tempId))
            alert(`Failed to send message: ${error}`)
        })

        setSocket(newSocket)

        return () => {
            newSocket.emit('leaveRoom', { roomId })
            newSocket.close()
        }
    }, [roomId])

    const sendMessage = (body) => {
        socket.emit('roomMessage', {
            roomId,
            senderId: userId,
            body
        })
    }

    return (
        <div>
            {messages.map(msg => (
                <div key={msg._id}>
                    {msg.body}
                    {msg.isOptimistic && <span>⏳</span>}
                    {msg.isConfirmed && <span>✓</span>}
                </div>
            ))}
            <button onClick={() => sendMessage('Hello!')}>Send</button>
        </div>
    )
}
```

### Vanilla JavaScript Example

```javascript
const socket = io('http://localhost:3000', {
    auth: { token: 'your-jwt-token' }
})

// Join room
socket.emit('joinRoom', { roomId: 'abc123' })

// Send message
function sendMessage(body) {
    socket.emit('roomMessage', {
        roomId: 'abc123',
        senderId: 'user123',
        body
    }, (response) => {
        if (response.success) {
            console.log('Message sent in', response.timing.emitTime, 'ms')
        }
    })
}

// Receive messages
const messages = new Map()

socket.on('roomMessageRecieved', (message) => {
    messages.set(message._id, message)
    renderMessage(message)
})

socket.on('roomMessageConfirmed', (message) => {
    messages.delete(message.tempId)
    messages.set(message._id, message)
    updateMessage(message.tempId, message)
})

socket.on('roomMessageFailed', ({ tempId, error }) => {
    messages.delete(tempId)
    removeMessage(tempId)
    showError(error)
})
```

---

## Performance Metrics

Expected timing (logged in server):
```
[RoomMessage] Message emitted in 2-5ms
[RoomMessage] Message saved to DB in 50-200ms
```

Client perceived latency: **< 5ms** ✨

---

## Event Constants

Actual event names from `src/utils/common/eventConstants.js`:

```javascript
// Channel/Group Chat Events
export const NEW_MESSAGE_EVENT = 'NewMessage'
export const NEW_MESSAGE_RECEIVED_EVENT = 'NewMessageReceived'
export const CHANNEL_MESSAGE_SENT = 'channelMessageSent'
export const CHANNEL_MESSAGE_CONFIRMED = 'channelMessageConfirmed'
export const CHANNEL_MESSAGE_FAILED = 'channelMessageFailed'

// Channel Management Events
export const JOIN_CHANNEL = 'JoinChannel'
export const LEAVE_CHANNEL = 'LeaveChannel'

// One-to-One Chat Events
export const ROOM_MESSAGE = 'roomMessage'
export const ROOM_MESSAGE_RECEIVED = 'roomMessageRecieved'
export const ROOM_MESSAGE_SENT = 'roomMessageSent'
export const ROOM_MESSAGE_CONFIRMED = 'roomMessageConfirmed'
export const ROOM_MESSAGE_FAILED = 'roomMessageFailed'

// Room Management Events
export const JOIN_ROOM = 'joinRoom'
export const LEAVE_ROOM = 'leaveRoom'

// WebRTC Events
export const OFFER = 'offer'
export const ANSWER = 'answer'
export const ICE_CANDIDATE = 'ice-candidate'
export const INCOMING_CALL_NOTIFICATION = 'IncomingCallNotification'
export const NEW_ANSWER = 'newAnswer'
export const NEW_ICE_CANDIDATE = 'newIce-candidate'

// Connection Events
export const CONNECT = 'connection'
export const DISCONNECT = 'disconnect'
export const RECONNECTED = 'reconnected'

// Multi-Device Events
export const ACCOUNT_LOGGED_IN_ELSEWHERE = 'accountLoggedInElsewhere'
export const ACCOUNT_ALREADY_LOGGED_IN = 'accountAlreadyLoggedIn'
```

---

## Complete Event Summary

### Events You Need to Emit (Client → Server)

| Event | Purpose | Required Fields |
|-------|---------|----------------|
| `joinRoom` | Join 1-on-1 chat room | `roomId` |
| `leaveRoom` | Leave 1-on-1 chat room | `roomId` |
| `roomMessage` | Send 1-on-1 message | `roomId`, `senderId`, `body` |
| `JoinChannel` | Join group channel | `channelId` |
| `LeaveChannel` | Leave group channel | `channelId` |
| `NewMessage` | Send channel message | `channelId`, `workspaceId`, `senderId`, `body` |
| `offer` | Send WebRTC offer | `from`, `to`, `offer` |
| `answer` | Send WebRTC answer | `answer`, `from`, `to` |
| `ice-candidate` | Send ICE candidate | `from`, `to`, `candidate` |

### Events You Need to Listen (Server → Client)

| Event | Purpose | When Fired |
|-------|---------|------------|
| `connect` | Connection established | On initial connect |
| `disconnect` | Connection lost | On disconnect |
| `reconnected` | Reconnection successful | After reconnect with room restoration |
| `accountLoggedInElsewhere` | New device login detected | When user logs in from another device (sent to old device) |
| `accountAlreadyLoggedIn` | Existing login detected | When user logs in from new device (sent to new device) |
| `roomMessageRecieved` | Receive 1-on-1 message | Instant, optimistic delivery |
| `roomMessageSent` | Your message sent | Confirmation to sender |
| `roomMessageConfirmed` | Message saved to DB | After successful DB save |
| `roomMessageFailed` | Message failed | If DB save fails |
| `NewMessageReceived` | Receive channel message | Instant, optimistic delivery |
| `channelMessageSent` | Your channel message sent | Confirmation to sender |
| `channelMessageConfirmed` | Channel message saved | After successful DB save |
| `channelMessageFailed` | Channel message failed | If DB save fails |
| `IncomingCallNotification` | Incoming call | When someone calls you |
| `newAnswer` | WebRTC answer received | During call setup |
| `newIce-candidate` | ICE candidate received | During call setup |

---

## Error Handling

### Connection Errors
```javascript
socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message)
    // Handle authentication failures, network issues, etc.
})

socket.on('connect_timeout', () => {
    console.error('Connection timeout')
})
```

### Event Validation Errors
All events with callbacks will return error responses:
```javascript
socket.emit('joinRoom', { roomId: null }, (response) => {
    if (!response.success) {
        console.error(response.message)  // "roomId is required"
    }
})
```

---

## Best Practices

1. **Always use callbacks** for critical operations to confirm success
2. **Handle optimistic updates** - Show messages immediately, replace with confirmed version
3. **Implement retry logic** for failed messages
4. **Clean up listeners** on component unmount to prevent memory leaks
5. **Store device sessions** for multi-device management
6. **Auto-rejoin rooms** on reconnection (handled automatically by server)
7. **Validate data** before emitting events
8. **Handle offline scenarios** - Queue messages when disconnected
