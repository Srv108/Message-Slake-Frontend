import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { RoomChatInput } from '@/components/atoms/ChatInput/RoomChatInput';
import { Message } from '@/components/molecules/Message/Message';
import { RoomHeader } from '@/components/molecules/Room/RoomHeader';
import { Button } from '@/components/ui/button';
import { useGetRoomById } from '@/hooks/api/room/useGetRoomById';
import { useAuth } from '@/hooks/context/useAuth';
import { useChatTheme } from '@/hooks/context/useChatTheme';
import { useRoomDetails } from '@/hooks/context/useRoomDetails';
import { useRoomMessage } from '@/hooks/context/useRoomMessage';
import { useSocket } from '@/hooks/context/useSocket';
import { seperateTimeFormat } from '@/utils/formatTime/seperator';

export const Room = () => {
    const location = useLocation();
    const userID = location?.state?.reciverId;
    const { roomId } = useParams();

    // ======================================================
    // 🔹 Refs and State
    // ======================================================
    const messageContainerListRef = useRef(null);
    const lastJoinedRoomRef = useRef(null);
    const lastTimeSeparatorRef = useRef('');
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // ======================================================
    // 🔹 Hooks
    // ======================================================
    const { currentRoomMessages, setCurrentRoom } = useRoomMessage();
    const { setRecieverId, setSenderId } = useRoomDetails();
    const { auth } = useAuth();
    const { joinRoom, isSocketReady, currentRoom: socketCurrentRoom } = useSocket();
    const { getCurrentTheme } = useChatTheme();
    const currentTheme = getCurrentTheme();

    const { isSuccess: roomStatus, roomDetails } = useGetRoomById(roomId);

    // ======================================================
    // 🔹 Scroll Handling
    // ======================================================
    const scrollToBottom = (smooth = false) => {
        if (messageContainerListRef.current) {
            messageContainerListRef.current.scrollTo({
                top: messageContainerListRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto',
            });
        }
    };

    // ======================================================
    // 🔹 Scroll when new message appears
    // ======================================================
    useEffect(() => {
        if (currentRoomMessages?.length > 0) {
            scrollToBottom(true);
        }
    }, [currentRoomMessages]);

    // ======================================================
    // 🔹 Handle room change
    // ======================================================
    useEffect(() => {
        if (!roomId) return;

        console.log('\n🔄 ========== ROOM CHANGE ==========');
        console.log('📍 New Room ID:', roomId);

        lastTimeSeparatorRef.current = '';
        setIsLoadingMessages(true);

        // Switch room and fetch messages
        setCurrentRoom(roomId);
    }, [roomId, setCurrentRoom]);

    // ======================================================
    // 🔹 Stop loading once messages are loaded (even if empty)
    // ======================================================
    useEffect(() => {
        if (currentRoomMessages) {
            setIsLoadingMessages(false);
        }
    }, [currentRoomMessages]);

    // ======================================================
    // 🔹 Join room via socket
    // ======================================================
    useEffect(() => {
        if (!roomId) return console.warn('⚠️ No roomId available');
        if (!isSocketReady) return console.warn('⚠️ Socket not ready, waiting...');

        if (socketCurrentRoom === roomId || lastJoinedRoomRef.current === roomId) {
            console.log('ℹ️ Already joined room:', roomId);
            return;
        }

        console.log('🚪 Joining room via socket:', roomId);
        joinRoom(roomId);
        lastJoinedRoomRef.current = roomId;
    }, [roomId, isSocketReady, socketCurrentRoom, joinRoom]);

    // ======================================================
    // 🔹 Update sender / receiver info
    // ======================================================
    useEffect(() => {
        if (roomStatus && roomDetails) {
            const isSender = roomDetails?.senderId?.toString() === auth?.user?.id;
            setRecieverId(isSender ? roomDetails?.recieverId : roomDetails?.senderId);
            setSenderId(isSender ? roomDetails?.senderId : roomDetails?.recieverId);
        }
    }, [roomStatus, roomDetails, setSenderId, setRecieverId, auth?.user?.id]);

    // ======================================================
    // 🔹 Loading and Fallback States
    // ======================================================
    if (!roomId) {
        return <div>Loading room...</div>;
    }

    if (isLoadingMessages) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Fetching latest messages...
            </div>
        );
    }

    // ======================================================
    // 🔹 Render UI
    // ======================================================
    return (
        <div 
            className={`flex flex-col h-full ${currentTheme.background} ${currentTheme.pattern || ''} transition-colors duration-300`}
            style={currentTheme.customBackground ? { backgroundColor: currentTheme.customBackground } : {}}
        >
            <RoomHeader userID={userID} roomId={roomId} />
            
            <div 
                ref={messageContainerListRef} 
                className="h-full overflow-y-auto p-3 sm:p-5 gap-y-2 mb-2 mt-1 relative"
            >
                {currentRoomMessages?.map((message) => {
                    const separator = seperateTimeFormat(message?.createdAt);
                    const shouldRenderSeparator = lastTimeSeparatorRef.current !== separator;
                    if (shouldRenderSeparator) lastTimeSeparatorRef.current = separator;

                    return (
                        <div key={message?._id}>
                            {shouldRenderSeparator && (
                                <div className="flex justify-center items-center">
                                    <Button
                                        className="text-center text-gray-700 bg-gray-50 border border-gray-200 my-2 font-medium hover:bg-gray-100 transition-colors rounded-md"
                                    >
                                        {separator}
                                    </Button>
                                </div>
                            )}
                            <Message  
                                messageId={message?._id}
                                authorId={message?.senderId?._id}
                                authorImage={message?.senderId?.avatar} 
                                authorName={message?.senderId?.username} 
                                createdAt={message?.createdAt} 
                                body={message?.body} 
                                image={message?.image}
                                type="dms"
                            />
                        </div>
                    );
                })}
            </div>

            <RoomChatInput />
        </div>
    );
};
