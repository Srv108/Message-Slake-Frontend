import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

import { useAuth } from '@/hooks/context/useAuth';
import { useChannelMessage } from '@/hooks/context/useChannelMessage';
import { useRoomDetails } from '@/hooks/context/useRoomDetails';
import { useRoomMessage } from '@/hooks/context/useRoomMessage';

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const { auth } = useAuth();
    
    // Socket state
    const [isSocketReady, setIsSocketReady] = useState(false);
    const [socketInstance, setSocketInstance] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [socketId, setSocketId] = useState(null);
    
    // Room/Channel state - stored in context
    const [currentChannel, setCurrentChannel] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    
    // Call state
    const [acceptCall, setCallAccepted] = useState(false);
    const [offerRecieved, setOfferRecieved] = useState(null);
    const [answerRecieved, setAnswerRecieved] = useState(null);
    const [candidateRecieved, setCandidateRecieved] = useState(null);
    const [renegotiationRequested, setRenegotiationRequested] = useState(null);

    // Use the new context methods
    const { addMessage: addChannelMessage } = useChannelMessage();
    const { addMessage: addRoomMessage } = useRoomMessage();
    const { setCurrentRoom: setRoomDetailsCurrentRoom } = useRoomDetails();



    // Refs for socket management
    const socketRef = useRef(null);
    const messageHandlersSetup = useRef(false);
    const isInitializing = useRef(false);
    const hasInitializedOnce = useRef(false);

     // ==================== MESSAGE HANDLERS ====================
    const handleNewChannelMessage = useCallback((message) => {
        /* if current channel id and comming message channel id are same then add message to channel */
        console.log('📨 Received channel message: ....from socket', message);
        addChannelMessage(message);
    }, [addChannelMessage ]);

    const handleNewRoomMessage = useCallback((message) => {
        console.log('📨 Received room message: ....from socket', message);
        addRoomMessage(message);
    }, [addRoomMessage]);

    // ==================== NETWORK STATUS MONITORING ====================
    useEffect(() => {
        const handleOnline = () => {
            // console.log('🌐 Network: ONLINE - Internet connection restored');
            setIsOnline(true);
            // Socket.IO will auto-reconnect, no need to manually reconnect
        };

        const handleOffline = () => {
            // console.log('🌐 Network: OFFLINE - Internet connection lost');
            setIsOnline(false);
            // Don't clear messages or disconnect - Socket.IO handles reconnection
            // Messages will be preserved and synced after reconnection
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Check initial status
        const initialStatus = navigator.onLine;
        // console.log('🌐 Initial network status:', initialStatus ? 'ONLINE' : 'OFFLINE');
        setIsOnline(initialStatus);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // ==================== REMOVED: Don't disconnect on offline ====================
    // Socket.IO automatically handles reconnection when network returns
    // Manual disconnect causes unnecessary state loss

    // ==================== SOCKET INITIALIZATION ====================
    useEffect(() => {

        // Step 1: Check authentication - STRICT validation
        if (!auth?.token || typeof auth.token !== 'string' || auth.token.trim() === '') {
            // console.log('⚠️ No valid auth token available');
            // console.log('  - auth exists:', !!auth);
            // console.log('  - auth.token exists:', !!auth?.token);
            // console.log('  - auth.token type:', typeof auth?.token);
            // console.log('  - auth.token value:', auth?.token ? `${auth.token.substring(0, 20)}...` : 'null');
            
            if (socketRef.current) {
                // console.log('🔌 User logged out, cleaning up socket...');
                socketRef.current.removeAllListeners();
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocketInstance(null);
                setIsSocketReady(false);
                setSocketId(null);
                messageHandlersSetup.current = false;
                isInitializing.current = false;
                hasInitializedOnce.current = false;
                
                // Clear all data
                // console.log('🧹 Clearing all message lists on logout');
                setCurrentChannel(null);
                setCurrentRoom(null);
            }
            return;
        }

        // Step 2: Check network connectivity
        if (!isOnline) {
            // console.log('🌐 Network offline - waiting for connection before creating socket');
            return;
        }

        // Step 3: Prevent multiple socket creation
        if (isInitializing.current) {
            // console.log('⏳ Socket initialization already in progress...');
            return;
        }

        // Step 4: Create socket only once
        if (!socketRef.current) {
            isInitializing.current = true;
            // console.log('\n🚀 ========== INITIALIZING SOCKET CONNECTION ==========');
            // console.log('📍 Step 1: Checking prerequisites');
            // console.log('  ✅ User authenticated:', !!auth.token);
            // console.log('  ✅ Token length:', auth.token.length);
            // console.log('  ✅ Token preview:', `${auth.token.substring(0, 30)}...`);
            // console.log('  ✅ Network online:', isOnline);
            // console.log('  ✅ Socket URL:', import.meta.env.VITE_BACKEND_SOCKET_URL);
            
            // DON'T clear messages on socket init - only clear on logout
            // console.log('📝 Step 2: Preserving existing messages');
            
            // console.log('🔌 Step 3: Creating socket instance with auth token...');
            const newSocket = io(import.meta.env.VITE_BACKEND_SOCKET_URL, {
                auth: {
                    token: auth.token  // Backend expects auth.token
                },
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 10000,
                transports: ['websocket', 'polling']
            });
            
            // console.log('📍 Socket config:', {
            //     url: import.meta.env.VITE_BACKEND_SOCKET_URL,
            //     hasToken: !!auth.token,
            //     tokenLength: auth.token.length
            // });

            socketRef.current = newSocket;
            setSocketInstance(newSocket);
            hasInitializedOnce.current = true;
            // console.log('✅ Socket instance created and stored');
            // console.log('==================================================\n');

            // ==================== CONNECTION EVENT HANDLERS ====================
            newSocket.on('connect', () => {
                // console.log('\n🎉 ========== SOCKET CONNECTED ==========');
                // console.log('📍 Socket ID:', newSocket.id);
                // console.log('📍 Transport:', newSocket.io.engine.transport.name);
                
                setIsSocketReady(true);
                setSocketId(newSocket.id);
                setSocketInstance(newSocket);
                isInitializing.current = false;

                // Join personal notification room
                const personalRoom = `${auth?.user?.username}-${auth?.user?.id}`;
                // console.log('🚪 Joining personal notification room:', personalRoom);
                newSocket.emit('joinRoom', { roomId: personalRoom }, (ack) => {
                    console.log('✅ Personal room joined:', ack?.message || ack);
                });
                
                console.log('==================================================\n');
            });

            newSocket.on('disconnect', (reason) => {
                // console.log('\n⚠️ ========== SOCKET DISCONNECTED ==========');
                // console.log('📍 Reason:', reason);
                // console.log('📍 Will reconnect:', reason !== 'io client disconnect');
                
                setIsSocketReady(false);
                setSocketId(null);
                
                if (reason === 'io client disconnect') {
                    // console.log('🔌 Manual disconnect - cleaning up');
                    messageHandlersSetup.current = false;
                } else {
                    // console.log('🔄 Automatic reconnection will be attempted');
                }
                console.log('==================================================\n');
            });

            newSocket.on('connect_error', (error) => {
                console.error('❌ Socket connection error:', error.message);
                setIsSocketReady(false);
                isInitializing.current = false;
            });

            // ==================== RECONNECTION HANDLERS ====================
            
            // Backend's special 'reconnected' event - rooms are auto-restored
            newSocket.on('reconnected', async ({ message, rooms, previousSocketId }) => {
                console.log('\n🎉 ========== BACKEND RECONNECTED EVENT ==========');
                console.log('📍 Message:', message);
                console.log('📍 Previous Socket ID:', previousSocketId);
                console.log('📍 Restored Rooms:', rooms);
                console.log('✅ All previous rooms automatically rejoined by backend!');
                
                setIsSocketReady(true);
                setSocketId(newSocket.id);
                setSocketInstance(newSocket);
                
                // DON'T clear messages - they're preserved during reconnection
                // console.log('✅ Messages preserved during reconnection');
                
                // console.log('==================================================\n');
            });
            
            // Socket.io's standard reconnect event (fallback)
            newSocket.on('reconnect', async (attemptNumber) => {
                // console.log('\n🔄 ========== SOCKET.IO RECONNECT ==========');
                console.log('📍 Attempts taken:', attemptNumber);
                console.log('📍 Socket ID:', newSocket.id);
                
                setIsSocketReady(true);
                setSocketId(newSocket.id);
                setSocketInstance(newSocket);
                
                // DON'T clear messages - preserve them during reconnection
                // console.log('✅ Messages preserved during reconnection');
                
                // Wait briefly to ensure React state syncs before rejoining
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Manually rejoin current room/channel if backend didn't auto-restore
                if (currentChannel) {
                    console.log('🔄 Rejoining channel:', currentChannel);
                    newSocket.emit('JoinChannel', { channelId: currentChannel }, (ack) => {
                        console.log('✅ Channel rejoined:', ack?.message || ack);
                    });
                }
                
                if (currentRoom) {
                    console.log('🔄 Rejoining room:', currentRoom);
                    newSocket.emit('joinRoom', { roomId: currentRoom }, (ack) => {
                        console.log('✅ Room rejoined:', ack?.message || ack);
                    });
                }
                
                console.log('==================================================\n');
            });

            newSocket.on('reconnect_attempt', (attemptNumber) => {
                console.log('🔄 Reconnection attempt #' + attemptNumber);
            });

            newSocket.on('reconnect_error', (error) => {
                console.error('❌ Reconnection error:', error.message);
            });

            newSocket.on('reconnect_failed', () => {
                // console.error('\n❌ ========== RECONNECTION FAILED ==========');
                // console.error('All reconnection attempts exhausted');
                // console.error('User may need to refresh the page');
                // console.error('==================================================\n');
                setIsSocketReady(false);
            });

            // Channel message event handlers
            // Listen for incoming channel messages from other users
            newSocket.on('NewMessageReceived', (message) => {
                console.log('📨 Channel message received from another user:', message);
                console.log('  - Message ID:', message._id);
                console.log('  - Sender:', message.senderId?.username);
                console.log('  - Channel:', message.channelId);
                console.log('  - Is Optimistic:', message.isOptimistic);
                
                handleNewChannelMessage(message);
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
                console.log('  - Real ID:', message._doc._id);
                console.log('  - Temp ID:', message._doc.tempId);
                
                // Replace temp ID with real ID
                // handleChannelMessageUpdate({ tempId: message.tempId, message });
            });

            // Listen for message failure
            newSocket.on('channelMessageFailed', (data) => {
                console.log('❌ Channel message failed:', data);
                console.log('  - Temp ID:', data.tempId);
                console.log('  - Error:', data.error);
                
                // Remove failed message
                // removeChannelMessageStable(data.tempId);
            });

            // Room message event handlers - matching server events
            // Listen for incoming messages from other users
            newSocket.on('roomMessageRecieved', (message) => {
                console.log('📥 Room message received from another user:', message);
                console.log('  - Message ID:', message._id);
                console.log('  - Sender:', message.senderId?.username);
                console.log('  - Room:', message.roomId);
                console.log('  - Is Optimistic:', message.isOptimistic);
                // const validRoomId = message.roomId === currentRoom || message.roomId === socketCurrentRoom;
                // if (validRoomId) {
                //     console.log('valid room ID received:', message.roomId);
                // }
                handleNewRoomMessage(message);
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
                console.log('  - Real ID:', message._doc._id);
                console.log('  - Temp ID:', message._doc.tempId);
                console.log('  - message room id :', message._doc.roomId);
                console.log('  - current room id :', currentRoom);
            });

            // Listen for message failure
            newSocket.on('roomMessageFailed', (data) => {
                console.log('❌ Room message failed:', data);
                console.log('  - Temp ID:', data.tempId);
                console.log('  - Error:', data.error);
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

            newSocket.on('renegotiation-request', (requestObj) => {
                console.log('🔄 Renegotiation requested by remote peer.');
                
                // Set state to trigger the initiator to create a new offer
                setRenegotiationRequested(requestObj);
            });

            messageHandlersSetup.current = true;
            console.log('✅ All event listeners setup complete');
        } else {
            // Socket already exists
            console.log('✅ Socket already exists and is persistent');
        }

        // No cleanup - socket persists across component re-renders
    }, [
        auth?.token, 
        auth?.user?.username, 
        auth?.user?.id, 
        isOnline, 
        currentChannel, 
        currentRoom, 
        handleNewChannelMessage,
        handleNewRoomMessage,
        setOfferRecieved, 
        setCallAccepted, 
        setAnswerRecieved, 
        setCandidateRecieved,
        setRenegotiationRequested
    ]);

    // ==================== JOIN ROOM FUNCTION ====================
    const joinRoom = useCallback((roomId) => {
        if (!roomId) {
            console.warn('⚠️ Cannot join room: roomId is required');
            return;
        }

        if (!socketRef.current) {
            console.warn('⚠️ Socket not available, cannot join room');
            return;
        }

        if (!isSocketReady) {
            console.warn('⚠️ Socket not ready, queueing room join:', roomId);
            socketRef.current.once('connect', () => {
                console.log('🔄 Socket connected, now joining room:', roomId);
                socketRef.current.emit('joinRoom', { roomId }, (response) => {
                    if (response?.success) {
                        console.log('✅ Room joined successfully:', response);
                        setCurrentRoom(roomId);
                        setRoomDetailsCurrentRoom(roomId);
                    } else {
                        console.error('❌ Failed to join room:', response);
                    }
                });
            });
            return;
        }

        if (roomId === currentRoom) {
            console.log('ℹ️ Already in room:', roomId);
            return;
        }

        console.log('\n🚪 ========== JOINING ROOM ==========');
        console.log('📍 Room ID:', roomId);
        console.log('📍 Previous Room:', currentRoom || 'None');
        
        socketRef.current.emit('joinRoom', { roomId }, (response) => {
            if (response?.success) {
                console.log('✅ Room joined successfully');
                console.log('📍 Connected users:', response.data?.connectedUsers || 'Unknown');
                setCurrentRoom(roomId);
                setRoomDetailsCurrentRoom(roomId);
            } else {
                console.error('❌ Failed to join room:', response);
            }
            console.log('==================================================\n');
        });
    }, [currentRoom, isSocketReady, setRoomDetailsCurrentRoom]);

    // ==================== JOIN CHANNEL FUNCTION ====================
    const joinChannel = useCallback((channelId) => {
        if (!channelId) {
            console.warn('⚠️ Cannot join channel: channelId is required');
            return;
        }

        if (!socketRef.current) {
            console.warn('⚠️ Socket not available, cannot join channel');
            return;
        }

        if (!isSocketReady) {
            console.warn('⚠️ Socket not ready, queueing channel join:', channelId);
            socketRef.current.once('connect', () => {
                console.log('🔄 Socket connected, now joining channel:', channelId);
                socketRef.current.emit('JoinChannel', { channelId }, (response) => {
                    if (response?.success) {
                        console.log('✅ Channel joined successfully:', response);
                        setCurrentChannel(channelId);
                    } else {
                        console.error('❌ Failed to join channel:', response);
                    }
                });
            });
            return;
        }

        if (channelId === currentChannel) {
            console.log('ℹ️ Already in channel:', channelId);
            return;
        }

        console.log('\n🚪 ========== JOINING CHANNEL ==========');
        console.log('📍 Channel ID:', channelId);
        console.log('📍 Previous Channel:', currentChannel || 'None');
        
        socketRef.current.emit('JoinChannel', { channelId }, (response) => {
            if (response?.success) {
                console.log('✅ Channel joined successfully');
                console.log('📍 Connected users:', response.data?.connectedUsers || 'Unknown');
                setCurrentChannel(channelId);
            } else {
                console.error('❌ Failed to join channel:', response);
            }
            console.log('==================================================\n');
        });
    }, [currentChannel, isSocketReady]);

    return (
        <SocketContext.Provider
            value={{
                socket: socketInstance || socketRef.current,
                isSocketReady,
                isOnline,
                socketId,
                currentChannel,
                currentRoom,
                joinChannel,
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
