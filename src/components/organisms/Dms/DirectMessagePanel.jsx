import { Loader, LogOut, Settings, TriangleAlertIcon, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { UserItem } from '@/components/atoms/UserItem/UserItem';
import { UnifiedPanelHeader } from '@/components/molecules/Common/UnifiedPanelHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCreateRoom } from '@/hooks/api/room/useCreateRoom';
import { useFtechAllRooms } from '@/hooks/api/room/useFetchAllRooms';
import { useAddMemberContext } from '@/hooks/context/useAddMemberContext';
import { useAuth } from '@/hooks/context/useAuth';

export const DirectMessagePanel = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { isFetching, isSuccess, AllRoomDetails } = useFtechAllRooms();
    const { auth } = useAuth();

    const { setOpenAddMemberModal, setIsPending, setFormSubmitHandler } = useAddMemberContext();
    const { isPending, createRoomMutation } = useCreateRoom();

    async function formHandlerFunction (username) {
        try {
            await createRoomMutation({
                username: username
            });

            
        } catch (error) {
            console.log('error coming in create room at direct message panel header',error);
        }
    }

    useEffect(() => {
        setIsPending(isPending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isPending]);

    function handleAddUser(){
        setOpenAddMemberModal(true);
        setFormSubmitHandler(() => formHandlerFunction);
    }

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const menuItems = [
        {
            label: 'Settings',
            icon: <Settings className='size-4' />,
            onClick: () => console.log('Settings clicked')
        },
        {
            label: 'Invite Friends',
            icon: <UserPlus className='size-4' />,
            onClick: () => console.log('Invite clicked')
        },
        {
            label: 'Logout',
            icon: <LogOut className='size-4' />,
            onClick: () => console.log('Logout clicked')
        }
    ];

    const roomList = useMemo(() => {
        // Filter rooms based on search query
        const filteredRooms = AllRoomDetails?.filter((room) => {
            const isUserSender = room?.senderId?._id.toString() === auth?.user?.id;
            const member = (isUserSender) ? room?.recieverId : room?.senderId;
            return member?.username?.toLowerCase().includes(searchQuery.toLowerCase());
        });

        return filteredRooms?.map((room) => {
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
    },[AllRoomDetails, auth, searchQuery]);

    if(isFetching){
        return (
            <div
                className='flex flex-col gap-y-2 h-full items-center justify-center bg-white dark:bg-slack-medium'
            >
                <Loader className='animate-spin size-6 text-gray-900 dark:text-white'/>
            </div>
        );
    }

    if(!isSuccess){
        return (
            <div
                className='flex flex-col gap-y-2 h-full items-center justify-center bg-white dark:bg-slack-medium'
            >
                <TriangleAlertIcon className='size-8 text-red-500'/>
            </div>
        );
    }

    return(
        <div className='flex flex-col h-full bg-white dark:bg-slack-medium'>
            <UnifiedPanelHeader
                appName='Message Slake'
                onAddClick={handleAddUser}
                addButtonLabel='New Chat'
                menuItems={menuItems}
                onSearch={handleSearch}
                searchPlaceholder='Search conversations...'
            />
            <ScrollArea className='h-[calc(100vh-128px)]'>
                <div className='flex flex-col px-2 mt-3'>
                    {roomList?.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-12 px-4'>
                            <p className='text-sm text-gray-600 dark:text-slate-400 text-center mb-2'>
                                No conversations found
                            </p>
                            <p className='text-xs text-gray-500 dark:text-slate-500 text-center'>
                                Start a new chat to get started
                            </p>
                        </div>
                    ) : (
                        roomList
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};