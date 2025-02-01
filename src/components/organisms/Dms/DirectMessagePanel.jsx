import { Loader, TriangleAlertIcon } from 'lucide-react';
import { useMemo } from 'react';

import { UserItem } from '@/components/atoms/UserItem/UserItem';
import { DirectMessagePanelHeaders } from '@/components/molecules/DirectMessage/DirectMessagePanelHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFtechAllRooms } from '@/hooks/api/room/useFetchAllRooms';
import { useAuth } from '@/hooks/context/useAuth';

export const DirectMessagePanel = () => {

    const { isFetching, isSuccess, AllRoomDetails } = useFtechAllRooms();
    const { auth } = useAuth();

    const roomList = useMemo(() => {
        return AllRoomDetails?.map((room) => {
            const isUserSender = room?.senderId?._id.toString() === auth?.user?.id;
            const member = (isUserSender) ? room?.recieverId : room?.senderId;
            const isRoomYourSelf = room?.recieverId?._id === room?.senderId?._id;
            return (
                <UserItem
                    key={room?._id}
                    id={room?._id}
                    type='dms'
                    label={member?.username}
                    image={member?.avatar}
                    reciverId={member?._id || null}
                    messageYourself={isRoomYourSelf}
                    lastMessage={room?.lastMessage?.body || null}
                    lastMessageTime={room?.lastMessage?.createdAt}
                    lastMessageSender={room?.lastMessage?.senderId?.username}
                />
            );
        });
    },[AllRoomDetails,auth]);

    if(isFetching){
        return (
            <div
                className='flex flex-col gap-y-2 h-full items-center justify-center text-white'
            >
                <Loader className='animate-spin size-6 text-white'/>
            </div>
        );
    }

    if(!isSuccess){
        return (
            <div
                className='flex flex-col gap-y-2 h-full items-center justify-center text-white'
            >
                <TriangleAlertIcon className='size-8 text-red-500'/>
            </div>
        );
    }
    return(
        <div
            className='flex flex-col h-full bg-slack-medium'
        >
            <DirectMessagePanelHeaders />
            <ScrollArea  >
                <div className='flex flex-col px-2 mt-3' >
                    {roomList}
                </div>
            </ScrollArea>
        </div>

    );
};