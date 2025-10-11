import { cva } from 'class-variance-authority';
import { ImagesIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRoomDetails } from '@/hooks/context/useRoomDetails';
import { useWorkspace } from '@/hooks/context/useWorkspace';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/formatTime/formatTime';
import { seperateTimeFormat } from '@/utils/formatTime/seperator';

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
    const { setCurrentRoom } = useRoomDetails();
    const messageRef = useRef(null);
    const [ messageContent, setMessageContent ] = useState('');

    // Determine link path based on type
    const getLinkProps = () => {
        if (type === 'workspace') {
            return { to: `/workspace/${currentWorkspace?._id}/members/${id}` };
        } else if (type === 'channel') {
            return { to: `/workspace/${currentWorkspace?._id}/channels/${id}` };
        } else {
            return { to: `/directMessages/chat/${id}`, state: { reciverId } };
        }
    };

    const linkProps = getLinkProps();

    // Handle room selection for DMs
    const handleRoomClick = () => {
        console.log('🔍 UserItem clicked:');
        console.log('  - type:', type);
        console.log('  - id:', id);
        console.log('  - label:', label);
        
        if (type === 'dms' && id) {
            console.log('🎯 UserItem: Setting current room to:', id);
            setCurrentRoom(id);
            console.log('✅ setCurrentRoom called from UserItem');
        } else {
            console.log('⚠️ Not a DM or no ID:', { type, id });
        }
    };

    useEffect(() => {
        const textContent = messageRef.current.innerText;
        setMessageContent(textContent);
    },[lastMessage]);

    function handleLastMessageTime(str){
        if(seperateTimeFormat(str) === 'Today'){
            return formatTime(str);
        }
        return seperateTimeFormat(str);
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
                    <Link {...linkProps} onClick={handleRoomClick} className="flex items-center space-x-5 w-4/5">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={image} className="rounded-full w-full h-full object-cover" />
                            <AvatarFallback className="rounded-full bg-slate-600 text-white text-xl font-bold">
                                {label.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 w-full">
                            <p className="text-sm text-teal-300 font-serif font-bold truncate">{label}{(messageYourself) ? ' (You)' : ''}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap space-x-2">
                                { lastMessage ? (messageContent || image && ( 
                                    <span className="flex items-center gap-1">
                                        <ImagesIcon className="size-3 text-gray-400" />
                                        <span className="text-xs text-gray-400">Image</span>
                                    </span>
                                )) : 'tap to chat'}
                            </p>
                        </div>
                    </Link>
                    

                    <div className="text-xs text-gray-400 w-1/5 flex items-center justify-end space-x-2">
                        <div className='flex flex-col justify-center items-end space-y-1'>
                            <span>{ lastMessageTime ? handleLastMessageTime(lastMessageTime) : '00:00'}</span>
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