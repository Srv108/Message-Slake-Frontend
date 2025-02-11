import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

import { MessageRenderer } from '@/components/atoms/MessageRenderer/MessageRenderer';
import { MessageThumbnail } from '@/components/atoms/MessageThumbnail/MessageThumbnail';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDeleteMessage } from '@/hooks/api/room/useDeleteMessage';
import { useAuth } from '@/hooks/context/useAuth';
import { useConfirm } from '@/hooks/useConfirm';
import { formatTime } from '@/utils/formatTime/formatTime';

export const Message = ({
    messageId,
    authorId,
    authorImage,
    authorName,
    createdAt,
    body,
    image,
    type
}) => {

    const { auth } = useAuth();
    const queryClient = useQueryClient();

    const isLoggedInUser = (auth?.user?.id === authorId);
    const [ currentDate ] = useState(new Date());


    const { deleteMessageMutation } = useDeleteMessage();
    const { ConfirmDialog, confirmation } = useConfirm({
            title: 'Confirm Deletion',
            message: 'Are you sure want to delete'
        });

    function handleMessageTime(str) {
        return formatTime(currentDate,str);
    }

    async function handleDeleteMessage(){
        try {
            setTimeout(() => {},10);
            const ok = await confirmation();
            if(!ok) return;

            if(type === 'dms'){
                await deleteMessageMutation({
                    messageId: messageId
                });
                queryClient.invalidateQueries('fetchRoomMessages');
            }
        } catch (error) {
            console.log('failed to delete message',error);
        }
    }
    return (
        <>
            <ConfirmDialog />
            <div className={`mb-3 flex ${isLoggedInUser ? 'justify-end' : 'justify-start'}`}>
                <div className="relative group flex gap-2 max-w-[70%] min-w-[120px] bg-slate-500 text-black rounded-lg shadow-md p-3 pb-5">
                    
                    {type !== 'dms' && !isLoggedInUser && (
                        <div className="flex-shrink-0 flex items-end">
                            <Avatar>
                                <AvatarImage src={authorImage} className="rounded-full w-9 h-9" />
                                <AvatarFallback className="rounded-full bg-sky-500 text-white text-sm w-9 h-9 flex items-center justify-center">
                                    {authorName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}
                    
                    <div className="flex flex-col w-full min-w-[80px]">
                        {type !== 'dms' && !isLoggedInUser && (
                            <div className="flex items-start text-sm mb-1">
                                <span className="font-extrabold font-serif">{authorName}</span>
                            </div>
                        )}
                        {image && <MessageThumbnail url={image} />}
                        
                        <div className="relative flex flex-col w-full pr-4 pb-1">
                            <MessageRenderer value={body} />
                        </div>
                        <span className="absolute bottom-2 right-4 text-xs text-blue-900 font-bold whitespace-nowrap">
                            {handleMessageTime(createdAt)}
                        </span>

                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <button className="absolute top-1 right-1 p-1  border border-slack-dark-medium rounded-sm scale-75 opacity-0 group-hover:opacity-100 hover:scale-90 group-hover:bg-slack transition-all ease-in-out duration-200">
                                <FaChevronDown className='size-4 text-teal-600' />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className='bg-slack-medium font-serif text-teal-500 font-medium border-0 border-slack-dark'
                        >
                            <DropdownMenuItem>React</DropdownMenuItem>
                            <DropdownMenuItem>Reply</DropdownMenuItem>
                            <DropdownMenuItem>Forward</DropdownMenuItem>
                            <DropdownMenuItem>Copy</DropdownMenuItem>
                            <DropdownMenuItem>Info</DropdownMenuItem>
                            <DropdownMenuSeparator className='p-0.5 bg-slack-dark'/>
                            {image && <DropdownMenuItem
                                onClick={() => {}}
                            > Save </DropdownMenuItem>}
                            <DropdownMenuItem
                                onClick={handleDeleteMessage}
                            >Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    );
};
