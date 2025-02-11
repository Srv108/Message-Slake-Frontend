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
import { useRoomDetails } from '@/hooks/context/useRoomDetails';
import { useRoomMessage } from '@/hooks/context/useRoomMessage';
import { useSocket } from '@/hooks/context/useSocket';
import { seperateTimeFormat } from '@/utils/formatTime/seperator';

export const Room = () => {
    
    const location = useLocation();
    const userID = location?.state?.reciverId;

    const params = useParams();
    const roomId = params?.roomId;

    const hasJoinedRoom = useRef(false);
    const messageContainerListRef = useRef(null);

    const queryClient = useQueryClient();
    const { roomMessageList, setRoomMessageList } = useRoomMessage();
    const { setRecieverId, setSenderId } = useRoomDetails();
    const lastTimeSeparatorRef = useRef('');
    
    const { auth } = useAuth();
    const { joinRoom } = useSocket();

    const { isSuccess: roomStatus, roomDetails } = useGetRoomById(roomId);
    const { isSuccess, RoomMessageDetails } = useFetchRoomMessage(roomId);

    const scrollToBottom = () => {
        if (messageContainerListRef.current) {
            messageContainerListRef.current.scrollTop = messageContainerListRef.current.scrollHeight;
        }
    };


    useEffect(() => {
        scrollToBottom();
    },[roomMessageList]);

    useEffect(() => {
        queryClient.invalidateQueries('fetchRoomMessages');
        scrollToBottom();
    },[roomId]);

    useEffect(() => {
        if(roomStatus){
            console.log('room coming is', roomDetails);
        }
    },[roomStatus,roomDetails]);


    useEffect(() => {
        if (roomId && !hasJoinedRoom.current) {
            joinRoom(roomId);
            scrollToBottom();
            hasJoinedRoom.current = true;
        }

        return () => {
            hasJoinedRoom.current = false;
        };
    }, [roomId]);
    
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

    useEffect(() => {
        if (isSuccess) {
            setRoomMessageList(RoomMessageDetails);
            scrollToBottom();
            console.log('messages of room coming is', RoomMessageDetails);
        }
    }, [isSuccess, RoomMessageDetails, setRoomMessageList]);

    if (!roomId) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col h-full bg-slack'>
            <RoomHeader userID={userID} roomId={roomId}/>
            <div 
                ref={messageContainerListRef} 
                className='h-full overflow-y-auto p-5 gap-y-2 mb-2 mt-1'
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
                                        className="text-center text-teal-600 bg-slack-dark my-2 font-semibold"
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
