# Stateful Socket Architecture

## Overview

The socket system has been refactored from a **stateless** to a **stateful** architecture to dramatically improve real-time messaging performance. Messages are now delivered to connected users **instantly** before being saved to the database.

## Key Improvements

### 1. **Stateful Connection Management**
- **SocketManager** maintains in-memory state of all connected users
- Tracks user-to-socket mappings and room memberships
- Eliminates need for database lookups during message delivery

### 2. **Optimistic Message Delivery**
- Messages are emitted to all connected users **FIRST**
- Database save happens **asynchronously** in the background
- Users see messages instantly without waiting for DB operations

### 3. **Message Confirmation Flow**
1. User sends message
2. Server creates optimistic message with temporary ID
3. Server emits to all connected users immediately (< 5ms)
4. Server saves to database asynchronously
5. Server emits confirmation with real DB ID
6. Client replaces temporary ID with real ID

## Architecture Components

### SocketManager (`src/utils/socketManager.js`)

Central state manager that tracks:
- **Users Map**: `userId -> { socketId, user, rooms: Set<roomId> }`
- **Socket Map**: `socketId -> userId`
- **Rooms Map**: `roomId -> Set<userId>`

**Key Methods:**
- `addUser(socketId, user)` - Register user connection
- `removeUser(socketId)` - Clean up on disconnect
- `joinRoom(userId, roomId)` - Add user to room
- `leaveRoom(userId, roomId)` - Remove user from room
- `getUsersInRoom(roomId)` - Get all connected users in a room
- `getSocketId(userId)` - Get socket ID for a user

### Message Flow

#### One-to-One Chat (`message2SocketController.js`)

**Event: `roomMessage`**

```javascript
// 1. Create optimistic message
const optimisticMessage = {
    _id: 'temp_...',
    body: data.body,
    senderId: { _id, ...user },
    isOptimistic: true
}

// 2. Emit to all users in room IMMEDIATELY
usersInRoom.forEach(({ socketId }) => {
    io.to(socketId).emit('roomMessageRecieved', optimisticMessage)
})

// 3. Save to DB asynchronously
createMessageService(data).then(realMessage => {
    // 4. Emit confirmation with real ID
    io.to(socketId).emit('roomMessageConfirmed', {
        ...realMessage,
        tempId: optimisticMessage._id
    })
})
```

**Client Events:**
- `roomMessageRecieved` - Instant message delivery (optimistic)
- `roomMessageSent` - Confirmation to sender
- `roomMessageConfirmed` - DB save confirmation with real ID
- `roomMessageFailed` - Error notification

#### Group/Channel Chat (`messageSocketController.js`)

**Event: `NEW_MESSAGE_EVENT`**

Same flow as one-to-one, but for channels:

**Client Events:**
- `NEW_MESSAGE_RECEIVED_EVENT` - Instant message delivery (optimistic)
- `channelMessageSent` - Confirmation to sender
- `channelMessageConfirmed` - DB save confirmation with real ID
- `channelMessageFailed` - Error notification

### Room Management

#### Join Room (`roomSocketController.js`)

```javascript
socket.on('joinRoom', (data) => {
    // 1. Join Socket.IO room
    socket.join(roomId)
    
    // 2. Register in SocketManager
    socketManager.joinRoom(userId, roomId)
})
```

#### Join Channel (`channelSocketController.js`)

```javascript
socket.on('JOIN_CHANNEL', (data) => {
    // 1. Join Socket.IO room
    socket.join(channelId)
    
    // 2. Register in SocketManager
    socketManager.joinRoom(userId, channelId)
})
```

### Connection Lifecycle (`index.js`)

```javascript
io.on('connection', (socket) => {
    // Register user
    socketManager.addUser(socket.id, user)
    
    // Initialize handlers
    roomSocketHandler(io, socket)
    message2SocketHandler(io, socket)
    channelSocketHandler(io, socket)
    messageSocketHandler(io, socket)
})

socket.on('disconnect', () => {
    // Clean up all user data
    socketManager.removeUser(socket.id)
})
```

## Performance Benefits

### Before (Stateless)
1. User sends message
2. Server saves to DB (50-200ms)
3. Server fetches message details from DB (20-50ms)
4. Server emits to room (uses Socket.IO rooms)
5. **Total: 70-250ms**

### After (Stateful)
1. User sends message
2. Server emits to all connected users (**< 5ms**)
3. Server saves to DB asynchronously (50-200ms in background)
4. Server emits confirmation
5. **Perceived latency: < 5ms** ✨

## Client Implementation Guide

### Handling Optimistic Messages

```javascript
// 1. Send message
socket.emit('roomMessage', messageData, (response) => {
    console.log('Message sent:', response)
})

// 2. Receive optimistic message (instant)
socket.on('roomMessageRecieved', (message) => {
    if (message.isOptimistic) {
        // Add to UI with temporary ID
        addMessageToUI(message)
    }
})

// 3. Receive confirmation with real ID
socket.on('roomMessageConfirmed', (message) => {
    // Replace temporary message with real one
    updateMessageInUI(message.tempId, message)
})

// 4. Handle failures
socket.on('roomMessageFailed', ({ tempId, error }) => {
    // Show error and remove optimistic message
    removeMessageFromUI(tempId)
    showError(error)
})
```

### Best Practices

1. **Always handle optimistic messages**
   - Display immediately with loading indicator
   - Replace with confirmed message when received

2. **Handle failures gracefully**
   - Remove failed messages
   - Show retry option
   - Don't leave orphaned optimistic messages

3. **Track message states**
   ```javascript
   const messageStates = {
       SENDING: 'sending',      // Optimistic
       SENT: 'sent',            // Confirmed
       FAILED: 'failed'         // Error
   }
   ```

4. **Join rooms on navigation**
   ```javascript
   // When opening a chat/channel
   socket.emit('joinRoom', { roomId })
   
   // When leaving
   socket.emit('leaveRoom', { roomId })
   ```

## Monitoring & Debugging

### Get Current Stats

```javascript
const stats = socketManager.getStats()
// { totalUsers: 42, totalRooms: 15, totalSockets: 42 }
```

### Debug State

```javascript
socketManager.printState()
// Prints detailed state of all users and rooms
```

### Logs

All socket operations are logged with prefixes:
- `[SocketManager]` - State management
- `[RoomMessage]` - One-to-one messages
- `[ChannelMessage]` - Group messages
- `[JoinRoom]` / `[JoinChannel]` - Room operations

## Error Handling

### Database Failures

If DB save fails:
1. Users still received the message (optimistic)
2. Failure event is emitted to all users
3. Clients should remove the optimistic message
4. User can retry sending

### Connection Issues

- SocketManager automatically cleans up on disconnect
- Rejoining rooms on reconnect is client's responsibility
- Consider implementing reconnection logic with room state restoration

## Migration Notes

### Breaking Changes

1. **New Events**: Clients must handle new confirmation events
2. **Temporary IDs**: Messages now have temporary IDs initially
3. **Room Joining**: Must explicitly join rooms before receiving messages

### Backward Compatibility

Old events still work but won't benefit from optimistic delivery:
- `NEW_MESSAGE_RECEIVED_EVENT` - Still emitted (optimistic)
- `roomMessageRecieved` - Still emitted (optimistic)

### Migration Steps

1. Update client to handle new events
2. Implement optimistic UI updates
3. Add error handling for failed messages
4. Test with network throttling

## Future Enhancements

1. **Presence System**: Track online/offline status
2. **Typing Indicators**: Real-time typing status
3. **Read Receipts**: Track message read status
4. **Message Queuing**: Queue messages during disconnection
5. **Persistence**: Redis-backed SocketManager for multi-server setup

## Testing

### Manual Testing

1. **Message Delivery Speed**
   ```bash
   # Monitor logs for timing
   [RoomMessage] Message emitted in 2ms
   [RoomMessage] Message saved to DB in 87ms
   ```

2. **Multiple Users**
   - Open multiple browser tabs
   - Send messages between users
   - Verify instant delivery

3. **Network Conditions**
   - Throttle network in DevTools
   - Verify optimistic updates work
   - Check DB save happens in background

### Load Testing

```javascript
// Simulate 100 concurrent users
for (let i = 0; i < 100; i++) {
    const socket = io('http://localhost:3000', { auth: { token } })
    socket.emit('joinRoom', { roomId: 'test' })
}
```

## Troubleshooting

### Messages not delivered instantly

1. Check if user joined the room: `socketManager.isUserInRoom(userId, roomId)`
2. Verify SocketManager has user: `socketManager.getSocketId(userId)`
3. Check logs for emit confirmation

### Memory leaks

1. Monitor stats: `socketManager.getStats()`
2. Ensure disconnect handler is called
3. Check for orphaned rooms

### Duplicate messages

1. Verify client doesn't add optimistic message twice
2. Check tempId matching in confirmation handler
3. Ensure proper message deduplication

## Support

For issues or questions:
1. Check logs with `[SocketManager]` prefix
2. Use `socketManager.printState()` for debugging
3. Monitor timing logs for performance issues
