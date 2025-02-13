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
                            className='bg-slack-medium font-serif text-teal-500 font-medium border-2 border-slack-dark'
                        >
                            <DropdownMenuItem>React</DropdownMenuItem>
                            <DropdownMenuItem>Reply</DropdownMenuItem>
                            <DropdownMenuItem>Forward</DropdownMenuItem>
                            <DropdownMenuItem>Copy</DropdownMenuItem>
                            <DropdownMenuItem>Info</DropdownMenuItem>
                            {(image || isLoggedInUser) && <DropdownMenuSeparator className='p-[1px] bg-slack-dark'/>}
                            {image && <DropdownMenuItem
                                onClick={handleSaveImage}
                            > Save </DropdownMenuItem>}
                            {isLoggedInUser && <DropdownMenuItem
                                onClick={handleDeleteMessage}
                            >Delete</DropdownMenuItem>}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    );
};
