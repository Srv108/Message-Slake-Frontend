import { ChevronDownIcon, MessageSquarePlusIcon } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useCreateRoom } from '@/hooks/api/room/useCreateRoom';
import { useAddMemberContext } from '@/hooks/context/useAddMemberContext';

export const DirectMessagePanelHeaders = () => {

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

    function newChatIconClick(){
        setOpenAddMemberModal(true);
        setFormSubmitHandler(() => formHandlerFunction);
    }

    return (
        <>
        <div className='flex items-center justify-between px-4 h-[50px] gap-0.5'>
            <Button
                variant='transparent'
                className='font-semibold text-lg w-auto  p-1.5 overflow-hidden'
            >
                <span className='min-w-[100px] font-serif text-teal-600'>
                    New Chat
                </span>
                <ChevronDownIcon className="text-teal-300"/>
            </Button>
            <div className='flex items-center'>
                    <Button
                        variant='transparent'
                        size='sm'
                        onClick={newChatIconClick}
                    >
                        <MessageSquarePlusIcon className='size-5 text-teal-300'/>
                    </Button>
            </div>
        </div>
        </>
    );
};