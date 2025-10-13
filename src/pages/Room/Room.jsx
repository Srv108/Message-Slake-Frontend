import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { RoomChatInput } from '@/components/atoms/ChatInput/RoomChatInput';
import { Message } from '@/components/molecules/Message/Message';
import { RoomHeader } from '@/components/molecules/Room/RoomHeader';
import { Button } from '@/components/ui/button';
import { useFetchRoomMessage } from '@/hooks/api/room/useFetchRoomMessage';
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

    const params = useParams();
    const roomId = params?.roomId;

    const messageContainerListRef = useRef(null);
    const hasLoadedMessages = useRef(false);
    const lastJoinedRoomRef = useRef(null);

    const queryClient = useQueryClient();
    const { roomMessageList, setRoomMessageList } = useRoomMessage();
    const { setRecieverId, setSenderId } = useRoomDetails();
    const lastTimeSeparatorRef = useRef('');
    
    const { auth } = useAuth();
    const { joinRoom, isSocketReady, currentRoom: socketCurrentRoom } = useSocket();
    const { getCurrentTheme } = useChatTheme();
    
    const currentTheme = getCurrentTheme();

    const { isSuccess: roomStatus, roomDetails } = useGetRoomById(roomId);
    const { isSuccess, isFetching, isError, RoomMessageDetails } = useFetchRoomMessage(roomId);

    const scrollToBottom = () => {
        if (messageContainerListRef.current) {
            messageContainerListRef.current.scrollTop = messageContainerListRef.current.scrollHeight;
        }
    };

    // Load initial messages only once when data is fetched
    useEffect(() => {
        if (isSuccess && RoomMessageDetails && !hasLoadedMessages.current) {
            console.log('📥 Loading initial room messages:', RoomMessageDetails.length);
            setRoomMessageList(RoomMessageDetails);
            scrollToBottom();
            hasLoadedMessages.current = true;
        }
    }, [isSuccess, RoomMessageDetails, setRoomMessageList]);

    // Monitor roomMessageList changes
    useEffect(() => {
        scrollToBottom();
    }, [roomMessageList]);

    // Reset and invalidate when roomId changes ONLY
    useEffect(() => {
        if (!roomId) return;
        
        console.log('\n🔄 ========== ROOM CHANGE ==========');
        console.log('📍 New Room ID:', roomId);
        
        // Clear old messages
        console.log('🧹 Clearing old room messages');
        setRoomMessageList([]);
        hasLoadedMessages.current = false;
        
        // Invalidate queries for fresh data
        queryClient.invalidateQueries(['fetchRoomMessages', roomId]);
        
        console.log('==================================================\n');
    }, [roomId, queryClient, setRoomMessageList]);

    // Join room via socket when roomId is available and socket is ready
    useEffect(() => {
        if (!roomId) {
            console.warn('⚠️ No roomId available');
            return;
        }

        if (!isSocketReady) {
            console.warn('⚠️ Socket not ready, waiting...');
            return;
        }

        // Prevent duplicate joins - check both socket state and our ref
        if (socketCurrentRoom === roomId || lastJoinedRoomRef.current === roomId) {
            console.log('ℹ️ Already in room:', roomId);
            return;
        }

        console.log('🚪 Joining room via socket:', roomId);
        joinRoom(roomId);
        lastJoinedRoomRef.current = roomId;
    }, [roomId, isSocketReady, socketCurrentRoom, joinRoom]);
    
    useEffect(() => {
        if (roomStatus && roomDetails) {
            if(roomDetails?.senderId?.toString() === auth?.user?.id){
                setRecieverId(roomDetails?.recieverId);
                setSenderId(roomDetails?.senderId);
            }else{
                setRecieverId(roomDetails?.senderId);
                setSenderId(roomDetails?.recieverId);
            }
        }
    }, [roomStatus,setSenderId,setRecieverId,roomId,roomDetails]);

    

    if (!roomId) {
        return <div>Loading...</div>;
    }

    return (
        <div 
            className={`flex flex-col h-full ${currentTheme.background} ${currentTheme.pattern || ''} transition-colors duration-300`}
            style={currentTheme.customBackground ? { backgroundColor: currentTheme.customBackground } : {}}
        >
            <RoomHeader userID={userID} roomId={roomId}/>
            <div 
                ref={messageContainerListRef} 
                className='h-full overflow-y-auto p-3 sm:p-5 gap-y-2 mb-2 mt-1 relative'
            >
                {roomMessageList?.map((message) => {
                    const separator = seperateTimeFormat(message?.createdAt);
                    const shouldRenderSeparator = lastTimeSeparatorRef.current !== separator;
                    
                    if (shouldRenderSeparator) {
                        lastTimeSeparatorRef.current = separator;
                    } 

                    return (
                        <div key={message?._id}>
                            {shouldRenderSeparator && (
                                <div className='flex justify-center items-center'>
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
                                type='dms'
                            />
                        </div>
                    );
                })}
            </div>
            <RoomChatInput />
        </div>
    );
};   