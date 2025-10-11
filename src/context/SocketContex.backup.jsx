import { useQueryClient } from '@tanstack/react-query';
import { createContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

import { useAuth } from '@/hooks/context/useAuth';
import { useChannelMessage } from '@/hooks/context/useChannelMessage';
import { useRoomDetails } from '@/hooks/context/useRoomDetails';
import { useRoomMessage } from '@/hooks/context/useRoomMessage';

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const { auth } = useAuth();
    const [currentChannel, setCurrentChannel] = useState(null);
    const [ acceptCall, setCallAccepted ] = useState(false);
    const [ offerRecieved, setOfferRecieved ] = useState(null);
    const [ answerRecieved, setAnswerRecieved ] = useState(null);
    const [ candidateRecieved, setCandidateRecieved ] = useState(null);

    const { messageList, setMessageList } = useChannelMessage();
    const { roomMessageList, setRoomMessageList } = useRoomMessage();
    const { currentRoom, setCurrentRoom } = useRoomDetails();

    // ✅ Use useRef to persist socket connection across renders
    const socketRef = useRef(null);
    const isConnecting = useRef(false);

    useEffect(() => {
        if (!auth?.token) {
            // User logged out, disconnect socket
            if (socketRef.current) {
                console.log('User logged out, disconnecting socket...');
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        // Only create socket if it doesn't exist
        if (!socketRef.current) {
            console.log('Creating new socket connection...');
            socketRef.current = io(import.meta.env.VITE_BACKEND_SOCKET_URL, {
                extraHeaders: {
                    'access-token': auth.token,
                },
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            // Connection event handlers
            socketRef.current.on('connect', () => {
                console.log('✅ Socket connected:', socketRef.current.id);

                // Join personal notification room
                socketRef.current.emit('joinRoom',{ roomId: `${auth?.user?.username}-${auth?.user?.id}`},(ack) => {
                    console.log(`✅ ${auth?.user?.username} joined personal notification:`, ack?.message);
                });

                // Rejoin current room if exists
                if (currentRoom) {
                    socketRef.current.emit('joinRoom', { roomId: currentRoom }, (ack) => {
                        console.log('✅ Rejoined room:', currentRoom, ack);
                    });
                }

                // Rejoin current channel if exists
                if (currentChannel) {
                    socketRef.current.emit('JoinChannel', { channelId: currentChannel }, (ack) => {
                        console.log('✅ Rejoined channel:', currentChannel, ack);
                    });
                }
            });

            socketRef.current.on('disconnect', (reason) => {
                console.log('❌ Socket disconnected:', reason);
            });

            socketRef.current.on('connect_error', (error) => {
                console.error('❌ Socket connection error:', error);
            });

            socketRef.current.on('reconnect', (attemptNumber) => {
                console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
            });

            // Message event handlers
            socketRef.current.on('NewMessageReceived', (data) => {
                console.log('📨 New channel message received:', data);
                setMessageList((prevList) => {
                    // Avoid duplicates
                    const exists = prevList.some(msg => msg._id === data._id);
                    if (exists) return prevList;
                    return [...prevList, data];
                });
                queryClient.invalidateQueries('getChannelMessages');
            });
        
            socketRef.current.on('roomMessageReceived', (data) => {
                console.log('📨 New room message received:', data);
                setRoomMessageList((prevList) => {
                    // Avoid duplicates
                    const exists = prevList.some(msg => msg._id === data._id);
                    if (exists) return prevList;
                    return [...prevList, data];
                });
                queryClient.invalidateQueries('fetchRoomMessages');
            });
        
            // Video call event handlers
            socketRef.current.on('IncomingCallNotification',(recievedOfferObject) => {
                console.log('📞 Incoming call from:', recievedOfferObject?.from?.username);
                console.log('Call object:', recievedOfferObject);
        
                const room = recievedOfferObject?.to?.room;
                console.log('Call room ID:', room);
        
                // Join room if not already in it
                if(currentRoom !== room){
                    socketRef.current.emit('joinRoom',{ roomId: room},(ack) => {
                        if(ack?.success){
                            console.log(`✅ Joined call room: ${room}`);
                        } else{
                            console.error('❌ Failed to join call room');
                        }
                    });
                }
        
                setCurrentRoom(room);
                setOfferRecieved(recievedOfferObject);
                setCallAccepted(true);
            });
        
            socketRef.current.on('newAnswer',(answerObject) => {
                console.log('📞 Answer received from remote peer:', answerObject);
                if(answerObject){
                    setAnswerRecieved(answerObject);
                }
            });
        
            socketRef.current.on('newIce-candidate',(candidateObject) => {
                console.log('📞 ICE candidate received:', candidateObject);
                if(candidateObject){
                    setCandidateRecieved(candidateObject);
                }
            });
        }

        // Cleanup function
        return () => {
            // Don't disconnect on every render, only on unmount or auth change
            if (!auth?.token && socketRef.current) {
                console.log('🧹 Cleaning up socket connection...');
                socketRef.current.removeAllListeners();
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [auth?.token, auth?.user?.username, auth?.user?.id]); // Only depend on auth token and user info

    
    // Join room and channel functions
    const joinRoom = async (roomId) => {
        if (roomId !== currentRoom && socketRef.current) {
            socketRef.current.emit('joinRoom', { roomId }, (data) => {
                console.log('Successfully joined room:', data);
                setCurrentRoom(data?.data);
            });
        }
    };

    const joinChannel = async (channelId) => {
        if (channelId !== currentChannel && socketRef.current) {
            socketRef.current.emit('JoinChannel', { channelId }, (data) => {
                console.log('Successfully joined the channel:', data);
                setCurrentChannel(data?.data);
            });
        }
    };

    useEffect(() => {
        if(currentRoom){
            joinRoom(currentRoom);
        }
    },[ currentRoom ]);

    useEffect(() => {
        if(currentChannel){
            joinChannel(currentChannel);
        }
    },[ currentChannel ]);

    
    return (
        <SocketContext.Provider
            value={{
                socket: socketRef.current,
                joinChannel,
                currentChannel,
                joinRoom,
                messageList,
                roomMessageList,
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
