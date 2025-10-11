import { useQueryClient } from '@tanstack/react-query';
import { FaChevronDown } from 'react-icons/fa';

import { getDownloadSignedUrlRequest } from '@/api/s3';
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


    const { deleteMessageMutation } = useDeleteMessage();
    const { ConfirmDialog, confirmation } = useConfirm({
            title: 'Confirm Deletion',
            message: 'Are you sure want to delete'
        });

    function handleMessageTime(str) {
        return formatTime(str);
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

    async function handleSaveImage() {
        try {
            
            const preSignedUrl = await queryClient.fetchQuery({
                queryKey: ['getDownloadPresignedUrl'],
                queryFn: async() => await getDownloadSignedUrlRequest({
                    messageId: messageId,
                    token: auth?.token
                })
            });

            const response = await fetch(preSignedUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const filename = `${authorName}-${new Date().toISOString()}.jpg`;
            const link = document.createElement('a');
            
            link.href = blobUrl;
            link.download = filename;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the blob URL after download
            URL.revokeObjectURL(blobUrl);

        } catch (error) {
            console.error('Error downloading the image:', error);
        }
    }
    
    return (
        <>
            <ConfirmDialog />
            <div className={`mb-2 flex items-end gap-1 ${isLoggedInUser ? 'justify-end' : 'justify-start'} px-2 md:px-4`}>
                {/* Avatar - Only for received messages in group chats */}
                {type !== 'dms' && !isLoggedInUser && (
                    <Avatar className="w-8 h-8 flex-shrink-0 mb-0.5">
                        <AvatarImage src={authorImage} className="rounded-full" />
                        <AvatarFallback className="rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-semibold">
                            {authorName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                )}

                <div className="relative group max-w-[85%] sm:max-w-[75%] md:max-w-[65%] min-w-[120px]">
                    {/* Telegram-style Tail - positioned at bottom corner */}
                    {isLoggedInUser ? (
                        <svg 
                            className="absolute bottom-0 right-0" 
                            width="8" 
                            height="13" 
                            viewBox="0 0 8 13"
                        >
                            <path 
                                d="M0,0 C0,0 8,0 8,7.5 C8,13 0,13 0,13 Z" 
                                fill="#0d9488"
                            />
                        </svg>
                    ) : (
                        <svg 
                            className="absolute bottom-0 left-0" 
                            width="8" 
                            height="13" 
                            viewBox="0 0 8 13"
                        >
                            <path 
                                d="M8,0 C8,0 0,0 0,7.5 C0,13 8,13 8,13 Z" 
                                fill="#334155"
                            />
                        </svg>
                    )}

                    {/* Message Bubble with Telegram-style rounded corners */}
                    <div className={`relative px-3 py-2 transition-all ${
                        isLoggedInUser 
                            ? 'bg-teal-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-[4px]' 
                            : 'bg-slate-700 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-[4px] rounded-br-2xl'
                    }`}>
                        {/* Author name for group chats */}
                        {type !== 'dms' && !isLoggedInUser && (
                            <div className="mb-1">
                                <span className="font-semibold text-sm text-teal-400">{authorName}</span>
                            </div>
                        )}
                        
                        {/* Image if present */}
                        {image && (
                            <div className="mb-1">
                                <MessageThumbnail url={image} />
                            </div>
                        )}
                        
                        {/* Message content */}
                        <div className="pr-14 pb-0.5">
                            <MessageRenderer value={body} />
                        </div>
                        
                        {/* Timestamp */}
                        <span className={`absolute bottom-1.5 right-2.5 text-[10px] font-normal whitespace-nowrap ${
                            isLoggedInUser ? 'text-teal-100/80' : 'text-slate-400'
                        }`}>
                            {handleMessageTime(createdAt)}
                        </span>
                    </div>
                    
                    {/* Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={`absolute top-0 right-0 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                                isLoggedInUser 
                                    ? 'hover:bg-teal-700' 
                                    : 'hover:bg-slate-600'
                            }`}>
                                <FaChevronDown className={`w-3 h-3 ${
                                    isLoggedInUser ? 'text-teal-100' : 'text-slate-300'
                                }`} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className='bg-slate-800 text-white font-medium border border-slate-700 shadow-xl'
                            align={isLoggedInUser ? 'end' : 'start'}
                        >
                            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer focus:bg-slate-700 focus:text-white">React</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer focus:bg-slate-700 focus:text-white">Reply</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer focus:bg-slate-700 focus:text-white">Forward</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer focus:bg-slate-700 focus:text-white">Copy</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer focus:bg-slate-700 focus:text-white">Info</DropdownMenuItem>
                            {(image || isLoggedInUser) && <DropdownMenuSeparator className='bg-slate-700'/>}
                            {image && <DropdownMenuItem
                                onClick={handleSaveImage}
                                className="hover:bg-slate-700 cursor-pointer focus:bg-slate-700 focus:text-white"
                            > Save </DropdownMenuItem>}
                            {isLoggedInUser && <DropdownMenuItem
                                onClick={handleDeleteMessage}
                                className="hover:bg-red-900/50 text-red-400 cursor-pointer focus:bg-red-900/50 focus:text-red-400"
                            >Delete</DropdownMenuItem>}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    );
};
