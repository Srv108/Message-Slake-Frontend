import { useState } from 'react';

import { MessageRenderer } from '@/components/atoms/MessageRenderer/MessageRenderer';
import { MessageThumbnail } from '@/components/atoms/MessageThumbnail/MessageThumbnail';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/context/useAuth';
import { formatTime } from '@/utils/formatTime/formatTime';

export const Message = ({
    authorId,
    authorImage,
    authorName,
    createdAt,
    body,
    image,
    type
}) => {

    const { auth } = useAuth();

    const isLoggedInUser = (auth?.user?.id === authorId);
    const [ currentDate ] = useState(new Date());



    function handleMessageTime(str) {
        return formatTime(currentDate,str);
    }

    return (
        <>
            <div className={`mb-3 flex ${isLoggedInUser ? 'justify-end' : 'justify-start'}`}>
                <div className="relative flex gap-2 max-w-[70%] min-w-[120px] bg-slate-500 text-black rounded-lg shadow-md p-3 pb-5">
                    
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
                </div>
            </div>
        </>
    );
};
