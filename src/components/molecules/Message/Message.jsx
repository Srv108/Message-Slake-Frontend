import { useEffect, useState } from 'react';

import { MessageRenderer } from '@/components/atoms/MessageRenderer/MessageRenderer';
import { MessageThumbnail } from '@/components/atoms/MessageThumbnail/MessageThumbnail';
// import { MessageThumbnail } from '@/components/atoms/MessageThumbnail/MessageThumbnail';
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
    const [ currentDate, setCurrentDate ] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        },1000);

        return () => clearInterval(intervalId);
    },[]);

    function handleMessageTime(str) {
        return formatTime(currentDate,str);
    }

    return (
        <div 
            className={`mb-3 flex  ${isLoggedInUser ? 'justify-end' : 'justify-start'}`}
        >
            <div 
                className='flex gap-2 max-w-[70%] bg-slate-500 text-black rounded-lg shadow-md p-3'
            >
                
                {type !== 'dms' &&
                    (isLoggedInUser? '' : <div 
                        className='flex-shrink-0 flex items-end'
                    >
                        <Avatar>
                            <AvatarImage src={authorImage} className="rounded-full w-9 h-9" />
                            <AvatarFallback className="rounded-full bg-sky-500 text-white text-sm w-9 h-9 flex items-center justify-center">
                                {authorName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>)
                }

                <div className='flex flex-col w-full'>
                    {type !== 'dms' &&
                        (isLoggedInUser ? '' : 
                        <div className={`flex items-center ${isLoggedInUser ? 'justify-end' : 'justify-start'} text-sm mb-1`}>
                            <span className="font-extrabold font-serif">{authorName}</span>
                        </div>)
                    }
                    { image && <MessageThumbnail url={image} />}
                    <div className={`flex flex-row ${body ? 'justify-between' : 'justify-end' } space-x-5 text-right`}>
                        <MessageRenderer value={body} />
                        <div className='flex items-end justify-end text-xs text-gray-500 mt-1 whitespace-nowrap'>
                            <span className='text-blue-900 font-semibold'>{handleMessageTime(createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
