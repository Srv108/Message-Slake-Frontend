import { cva } from 'class-variance-authority';
import { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/hooks/context/useWorkspace';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/formatTime/formatTime';

import { MessageRenderer } from '../MessageRenderer/MessageRenderer';

const userItemVariants = cva(
    'flex items-center gap-3 justify-start font-normal h-14 px-4 mt-2 text-sm border border-slack-dark rounded-md transition-colors duration-200',
    {
        variants: {
            variant: {
                default: 'text-[#f9edffcc] hover:bg-[#f9edff33]',
                active: 'text-[#481350] bg-white/90 hover:bg-white/80'
            }
        },
        defaultVariants: 'default'
    }
);

export const UserItem = ({
    id,
    type,
    label = 'Member',
    image,
    variant,
    reciverId,
    messageYourself,
    lastMessage,
    // lastMessageSender,
    lastMessageTime
}) => {

    const { currentWorkspace } = useWorkspace();
    const messageRef = useRef(null);
    const [ currentDate, setCurrentDate] = useState(new Date());
    const [ messageContent, setMessageContent ] = useState('');

    const linkProps = (type === 'workspace') 
        ? {to : `/workspace/${currentWorkspace?._id}/members/${id}`} 
        : {to : `/directMessages/chat/${id}`, state: {reciverId}};


    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        },1000);

        return () => clearInterval(intervalId);
    },[]);

    useEffect(() => {
        const textContent = messageRef.current.innerText;
        setMessageContent(textContent);
    },[lastMessage]);

    function handleLastMessageTime(str){
        return formatTime(currentDate,str);
    }
    return (
        <>
            <div ref={messageRef} className='hidden'>
                {lastMessage && <MessageRenderer value={lastMessage} />}
            </div>
            <Button
                className={cn(userItemVariants({ variant }))}
                variant="transparent"
                size="sm"
                asChild
            >
                
                <div className="w-full p-1 flex flex-row justify-between items-center">
                    <Link {...linkProps}  className="flex items-center space-x-5 w-4/5">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={image} className="rounded-full w-full h-full object-cover" />
                            <AvatarFallback className="rounded-full bg-slate-600 text-white text-xl font-bold">
                                {label.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 w-full">
                            <p className="text-sm text-white truncate">{label}{(messageYourself) ? ' (You)' : ''}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap space-x-2">
                                { lastMessage && messageContent || 'Hey, are you available'}
                            </p>
                        </div>
                    </Link>
                    

                    <div className="text-xs text-gray-400 w-1/5 flex items-center justify-end space-x-2">
                        <div className='flex flex-col justify-center items-end space-y-1'>
                            <span>{ lastMessageTime && handleLastMessageTime(lastMessageTime)}</span>
                            <div
                                size='iconSm'
                                onClick={() => console.log('icon is clicked')}
                                className='cursor-pointer transition-transform duration-200 hover:scale-150'
                            >
                                <FaChevronDown  className="size-5 cursor-pointer" />
                            </div>    
                        </div>   
                    </div>
                </div>
            </Button>
        </>
    );
};