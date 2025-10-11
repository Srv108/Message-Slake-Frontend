import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

import { useAuth } from '@/hooks/context/useAuth';
import { useChannelMessage } from '@/hooks/context/useChannelMessage';
import { useRoomDetails } from '@/hooks/context/useRoomDetails';
import { useRoomMessage } from '@/hooks/context/useRoomMessage';

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const { auth } = useAuth();
    const [currentChannel, setCurrentChannel] = useState(null);
    const [acceptCall, setCallAccepted] = useState(false);
    const [offerRecieved, setOfferRecieved] = useState(null);
    const [answerRecieved, setAnswerRecieved] = useState(null);
    const [candidateRecieved, setCandidateRecieved] = useState(null);
    const [isSocketReady, setIsSocketReady] = useState(false); // Track socket readiness
    const [socketInstance, setSocketInstance] = useState(null); // State for triggering re-renders

    const { setMessageList } = useChannelMessage();
    const { setRoomMessageList } = useRoomMessage();
    const { currentRoom, setCurrentRoom } = useRoomDetails();

    // ✅ Use useRef to persist socket connection across renders
    const socketRef = useRef(null);
    const messageHandlersSetup = useRef(false);
    const isInitializing = useRef(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Monitor network status
    useEffect(() => {
        const handleOnline = () => {
            console.log('🌐 Network: ONLINE - Internet connection restored');
            setIsOnline(true);
        };

        const handleOffline = () => {
            console.log('🌐 Network: OFFLINE - Internet connection lost');
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Check initial status
        console.log('🌐 Initial network status:', navigator.onLine ? 'ONLINE' : 'OFFLINE');

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Cleanup socket when offline
    useEffect(() => {
        if (!isOnline && socketRef.current) {
            console.log('🌐 Network offline - disconnecting socket gracefully');
            socketRef.current.disconnect();
            setIsSocketReady(false);
            setSocketInstance(null); // Clear state
            messageHandlersSetup.current = false;
            // Don't set socketRef.current to null - keep it for reconnection
        }
    }, [isOnline]);

    // Setup socket connection - runs when auth is available AND online
    useEffect(() => {
        if (!auth?.token) {
            // User logged out, disconnect socket
            if (socketRef.current) {
                console.log('🔌 User logged out, disconnecting socket...');
                socketRef.current.removeAllListeners();
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocketInstance(null); // Clear state
                setIsSocketReady(false);
                messageHandlersSetup.current = false;
                isInitializing.current = false;
            }
            return;
        }

        // Check if online before creating socket
        if (!isOnline) {
            console.log('🌐 Network offline - waiting for connection before creating socket');
            return;
        }

        // Prevent multiple socket creation attempts
        if (isInitializing.current) {
            console.log('⏳ Socket initialization already in progress...');
            return;
        }

        // Only create socket if it doesn't exist
        if (!socketRef.current) {
            isInitializing.current = true;
            console.log('🔌 Creating new socket connection...');
            const newSocket = io(import.meta.env.VITE_BACKEND_SOCKET_URL, {
                extraHeaders: {
                    'access-token': auth.token,
                },
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 10000,
            });

            socketRef.current = newSocket;
            setSocketInstance(newSocket); // Update state to trigger re-render
            isInitializing.current = false;
            console.log('✅ Socket instance created and stored in ref');

            // Connection event handlers
            newSocket.on('connect', () => {
                console.log('✅ Socket connected:', newSocket.id);
                setIsSocketReady(true); // Mark as ready
                setSocketInstance(newSocket); // Update state to ensure components get the connected socket

                // Join personal notification room
                const personalRoom = `${auth?.user?.username}-${auth?.user?.id}`;
                newSocket.emit('joinRoom', { roomId: personalRoom }, (ack) => {
                    console.log('✅ Joined personal notification room:', ack?.message || ack);
                });
            });

            newSocket.on('disconnect', (reason) => {
                console.log('❌ Socket disconnected:', reason);
                setIsSocketReady(false);
                // Don't clear socket ref on disconnect - allow reconnection
                // Only clear if it's a manual disconnect (io client disconnect)
                if (reason === 'io client disconnect') {
                    console.log('🔌 Manual disconnect detected');
                    messageHandlersSetup.current = false;
                } else {
                    console.log('🔄 Will attempt to reconnect...');
                    // Keep socket in ref for reconnection
                }
            });

            newSocket.on('connect_error', (error) => {
                console.error('❌ Socket connection error:', error.message);
            });

            newSocket.on('reconnect', (attemptNumber) => {
                console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
                setIsSocketReady(true); // Mark as ready again
                setSocketInstance(newSocket); // Update state to trigger re-render
                
                // Rejoin rooms/channels after reconnection
                if (currentChannel) {
                    console.log('🔄 Rejoining channel after reconnect:', currentChannel);
                    newSocket.emit('JoinChannel', { channelId: currentChannel }, (ack) => {
                        console.log('✅ Rejoined channel:', ack);
                    });
                }
                
                if (currentRoom) {
                    console.log('🔄 Rejoining room after reconnect:', currentRoom);
                    newSocket.emit('joinRoom', { roomId: currentRoom }, (ack) => {
                        console.log('✅ Rejoined room:', ack);
                    });
                }
            });

            newSocket.on('reconnect_attempt', (attemptNumber) => {
                console.log('🔄 Reconnection attempt:', attemptNumber);
            });

            newSocket.on('reconnect_error', (error) => {
                console.error('❌ Reconnection error:', error.message);
            });

            newSocket.on('reconnect_failed', () => {
                console.error('❌ Reconnection failed after all attempts');
            });

            // Channel message event handlers
            // Listen for incoming channel messages from other users
            newSocket.on('NewMessageReceived', (message) => {
                console.log('📨 Channel message received from another user:', message);
                console.log('  - Message ID:', message._id);
                console.log('  - Sender:', message.senderId?.username);
                console.log('  - Channel:', message.channelId);
                console.log('  - Is Optimistic:', message.isOptimistic);
                
                setMessageList((prevList) => {
                    const exists = prevList.some(msg => msg._id === message._id || msg._id === message.tempId);
                    if (exists) {
                        console.log('⚠️ Duplicate channel message ignored:', message._id);
                        return prevList;
                    }
                    console.log('✅ Adding received channel message to list');
                    return [...prevList, message];
                });
            });

            // Listen for sender confirmation (immediate)
            newSocket.on('channelMessageSent', (message) => {
                console.log('📤 Channel message sent confirmation:', message);
                console.log('  - Temp ID:', message._id);
                console.log('  - Body:', message.body);
                console.log('  - Is Optimistic:', message.isOptimistic);
                // Optimistic message already added, no need to add again
            });

            // Listen for DB confirmation (after save)
            newSocket.on('channelMessageConfirmed', (message) => {
                console.log('✅ Channel message confirmed (saved to DB):', message);
                console.log('  - Real ID:', message._id);
                console.log('  - Temp ID:', message.tempId);
                
                // Replace temp ID with real ID
                setMessageList((prevList) => 
                    prevList.map(msg => 
                        msg._id === message.tempId ? { ...msg, _id: message._id, isOptimistic: false } : msg
                    )
                );
            });

            // Listen for message failure
            newSocket.on('channelMessageFailed', (data) => {
                console.log('❌ Channel message failed:', data);
                console.log('  - Temp ID:', data.tempId);
                console.log('  - Error:', data.error);
                
                // Remove failed message
                setMessageList((prevList) => 
                    prevList.filter(msg => msg._id !== data.tempId)
                );
            });

            // Room message event handlers - matching server events
            // Listen for incoming messages from other users
            newSocket.on('roomMessageRecieved', (message) => {
                console.log('📥 Room message received from another user:', message);
                console.log('  - Message ID:', message._id);
                console.log('  - Sender:', message.senderId?.username);
                console.log('  - Room:', message.roomId);
                console.log('  - Is Optimistic:', message.isOptimistic);
                
                setRoomMessageList((prevList) => {
                    const exists = prevList.some(msg => msg._id === message._id || msg._id === message.tempId);
                    if (exists) {
                        console.log('⚠️ Duplicate room message ignored:', message._id);
                        return prevList;
                    }
                    console.log('✅ Adding received room message to list');
                    return [...prevList, message];
                });
            });

            // Listen for sender confirmation (immediate)
            newSocket.on('roomMessageSent', (message) => {
                console.log('📤 Room message sent confirmation:', message);
                console.log('  - Temp ID:', message._id);
                console.log('  - Body:', message.body);
                console.log('  - Is Optimistic:', message.isOptimistic);
                // Optimistic message already added, no need to add again
            });

            // Listen for DB confirmation (after save)
            newSocket.on('roomMessageConfirmed', (message) => {
                console.log('✅ Room message confirmed (saved to DB):', message);
                console.log('  - Real ID:', message._id);
                console.log('  - Temp ID:', message.tempId);
                
                // Replace temp ID with real ID
                setRoomMessageList((prevList) => 
                    prevList.map(msg => 
                        msg._id === message.tempId ? { ...msg, _id: message._id, isOptimistic: false } : msg
                    )
                );
            });

            // Listen for message failure
            newSocket.on('roomMessageFailed', (data) => {
                console.log('❌ Room message failed:', data);
                console.log('  - Temp ID:', data.tempId);
                console.log('  - Error:', data.error);
                
                // Remove failed message
                setRoomMessageList((prevList) => 
                    prevList.filter(msg => msg._id !== data.tempId)
                );
            });

            // Video call event handlers
            newSocket.on('IncomingCallNotification', (recievedOfferObject) => {
                console.log('📞 Incoming call from:', recievedOfferObject?.from?.username);
                
                const room = recievedOfferObject?.to?.room;
                console.log('📞 Call room ID:', room);

                if (currentRoom !== room) {
                    newSocket.emit('joinRoom', { roomId: room }, (ack) => {
                        if (ack?.success) {
                            console.log(`✅ Joined call room: ${room}`);
                        } else {
                            console.error('❌ Failed to join call room');
                        }
                    });
                }

                setCurrentRoom(room);
                setOfferRecieved(recievedOfferObject);
                setCallAccepted(true);
            });

            newSocket.on('newAnswer', (answerObject) => {
                console.log('📞 Answer received from remote peer');
                if (answerObject) {
                    setAnswerRecieved(answerObject);
                }
            });

            newSocket.on('newIce-candidate', (candidateObject) => {
                console.log('📞 ICE candidate received');
                if (candidateObject) {
                    setCandidateRecieved(candidateObject);
                }
            });

            messageHandlersSetup.current = true;
            console.log('✅ All event listeners setup complete');
        } else {
            // Socket already exists
            console.log('✅ Socket already exists and is persistent');
        }

        // No cleanup - socket persists across component re-renders
    }, [auth?.token, auth?.user?.username, auth?.user?.id, isOnline, currentChannel, currentRoom, setCurrentRoom, setMessageList, setRoomMessageList]);

    // Join room function with useCallback
    const joinRoom = useCallback((roomId) => {
        if (!socketRef.current) {
            console.warn('⚠️ Socket not available, cannot join room');
            return;
        }

        if (!socketRef.current.connected) {
            console.warn('⚠️ Socket not connected, queueing room join:', roomId);
            // Queue the join for when socket connects
            socketRef.current.once('connect', () => {
                console.log('🔄 Socket connected, now joining room:', roomId);
                socketRef.current.emit('joinRoom', { roomId }, (data) => {
                    console.log('✅ Successfully joined room:', data);
                    setCurrentRoom(roomId);
                });
            });
            return;
        }

        if (roomId !== currentRoom) {
            console.log('🚪 Joining room:', roomId);
            socketRef.current.emit('joinRoom', { roomId }, (data) => {
                console.log('✅ Successfully joined room:', data);
                setCurrentRoom(roomId);
            });
        } else {
            console.log('ℹ️ Already in room:', roomId);
        }
    }, [currentRoom, setCurrentRoom]);

    // Join channel function with useCallback
    const joinChannel = useCallback((channelId) => {
        if (!socketRef.current) {
            console.warn('⚠️ Socket not available, cannot join channel');
            return;
        }

        if (!socketRef.current.connected) {
            console.warn('⚠️ Socket not connected, queueing channel join:', channelId);
            // Queue the join for when socket connects
            socketRef.current.once('connect', () => {
                console.log('🔄 Socket connected, now joining channel:', channelId);
                socketRef.current.emit('JoinChannel', { channelId }, (data) => {
                    console.log('✅ Successfully joined channel:', data);
                    setCurrentChannel(channelId);
                });
            });
            return;
        }

        if (channelId !== currentChannel) {
            console.log('🚪 Joining channel:', channelId);
            socketRef.current.emit('JoinChannel', { channelId }, (data) => {
                console.log('✅ Successfully joined channel:', data);
                setCurrentChannel(channelId);
            });
        } else {
            console.log('ℹ️ Already in channel:', channelId);
        }
    }, [currentChannel]);

    // Auto-join room when currentRoom changes
    useEffect(() => {
        if (currentRoom && socketRef.current) {
            joinRoom(currentRoom);
        }
    }, [currentRoom, joinRoom]);

    // Auto-join channel when currentChannel changes
    useEffect(() => {
        if (currentChannel && socketRef.current) {
            joinChannel(currentChannel);
        }
    }, [currentChannel, joinChannel]);

    return (
        <SocketContext.Provider
            value={{
                socket: socketInstance || socketRef.current, // Use state first, fallback to ref
                isSocketReady,
                isOnline, // ✅ Expose network status
                joinChannel,
                currentChannel,
                joinRoom,
                acceptCall,
                offerRecieved,
                answerRecieved,
                setCallAccepted,
                setOfferRecieved,
                setAnswerRecieved,
                candidateRecieved,
                setCandidateRecieved
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
