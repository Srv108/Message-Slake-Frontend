import { Loader, MessageSquareTextIcon, SendHorizonalIcon, TriangleAlertIcon } from 'lucide-react';
import { useEffect } from 'react';

import { SideBarItem } from '@/components/atoms/SideBarItem/SideBarItem';
import { UserItem } from '@/components/atoms/UserItem/UserItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFtechAllRooms } from '@/hooks/api/room/useFetchAllRooms';
import { useAuth } from '@/hooks/context/useAuth';

export const DirectMessagePanel = () => {

    const { isFetching, isSuccess, AllRoomDetails } = useFtechAllRooms();
    const { auth } = useAuth();
    useEffect(() => {
        if(isSuccess) console.log(AllRoomDetails);
        
    },[isSuccess,AllRoomDetails]);
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
            <ScrollArea  >
                <div className='flex flex-col px-2 mt-3' >
                    <SideBarItem
                        label='Threads'
                        variant='active'
                        id='Thread'
                        Icon={MessageSquareTextIcon}
                    />
                    <SideBarItem
                        label='Drafts and Sends'
                        variant='default'
                        id='Thread'
                        Icon={SendHorizonalIcon}
                    />
                    {AllRoomDetails?.map((room) => {
                        const isUserSender = room?.senderId?._id.toString() === auth?.user?.id;
                        const member = (isUserSender) ? room?.recieverId : room?.senderId;
                        return (
                            <UserItem
                                key={member?._id}
                                id={member?._id}
                                type='dms'
                                label={member?.username}
                                image={member?.avatar}
                            />
                        );
                    })}
                </div>
            </ScrollArea>
        </div>

    );
};