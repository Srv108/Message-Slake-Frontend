import { ChevronDownIcon, MessageSquarePlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const DirectMessagePanelHeaders = () => {


    return (
        <>
        <div className='flex items-center justify-between px-4 h-[50px] gap-0.5'>
            <Button
                variant='transparent'
                className='font-semibold text-lg w-auto  p-1.5 overflow-hidden'
            >
                <span className='min-w-[100px] font-serif'>
                    New Chat
                </span>
                <ChevronDownIcon className=""/>
            </Button>
            <div className='flex items-center'>
                    <Button
                        variant='transparent'
                        size='sm'
                    >
                        <MessageSquarePlusIcon className='size-5'/>
                    </Button>
            </div>
        </div>
        </>
    );
};