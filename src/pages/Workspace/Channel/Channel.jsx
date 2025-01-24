import { useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { ChatInput } from '@/components/atoms/ChatInput/ChatInput';
import { ChannelHeader } from '@/components/molecules/Channel/ChannelHeader';
import { Message } from '@/components/molecules/Message/Message';
import { useGetChannelById } from '@/hooks/api/channel/useGetChannelById';
import { useGetChannelMessage } from '@/hooks/api/channel/useGetChannelMessage';
import { useChannelMessage } from '@/hooks/context/useChannelMessage';
import { useSocket } from '@/hooks/context/useSocket';

export const Channel = () => {

    const { channelId } = useParams();
    const hasJoinedChannel = useRef(false); 
    const queryClient = useQueryClient();
    const safeChannelId = channelId?.toString();
    const { isFetching, channelsDetails, isError } = useGetChannelById(safeChannelId);

    const { joinChannel } = useSocket();
    const { messageList, setMessageList } = useChannelMessage();

    const { 
        isSuccess, 
        channelMessages 
    } = useGetChannelMessage(safeChannelId);

    const messageContainerListRef = useRef(null);

    const scrollToBottom = () => {
        if (messageContainerListRef.current) {
            messageContainerListRef.current.scrollTop = messageContainerListRef?.current?.scrollHeight;
        }
    };
    
    useEffect(() => {
        scrollToBottom();
    },[messageList]);

    useEffect(() => {
        queryClient.invalidateQueries('getChannelMessages');
        scrollToBottom();
    }, [channelId]);

    useEffect(() => {
        if (channelId && !hasJoinedChannel.current && !isFetching && !isError && channelId) {
            joinChannel(channelId);
            scrollToBottom();
            hasJoinedChannel.current = true;
        }

        return () => {
            hasJoinedChannel.current = false;
        };
    },[isFetching,isError,channelId]);

    useEffect(() => {
        if(isSuccess){
            setMessageList(channelMessages);
            scrollToBottom();
        }
    }, [isSuccess,channelMessages,setMessageList,channelId]);

    if(isFetching) {
        return (
            <div
                className='h-full flex-1 flex items-center justify-center'
            >
                <Loader2Icon className='size-5 animate-spin text-muted-foreground' />
            </div>
        );
    }

    if(isError) {
        return (
            <div className='h-full flex-1 flex flex-col gap-y-2 items-center justify-center'>
                <TriangleAlertIcon className='size-6 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>Channel Not found</span>
            </div>
        );
    }

    
    return (
        <div className='flex flex-col h-full bg-slack'>
            <ChannelHeader name={channelsDetails?.name} />
            <div 
                ref={messageContainerListRef} 
                className='h-full overflow-y-auto p-5 gap-y-2 mb-2 mt-1'
            >
                {messageList?.map((message) => {
                    return <Message 
                        key={message?._id} 
                        authorId={message?.senderId?._id}
                        authorImage={message?.senderId?.avatar} 
                        authorName={message?.senderId?.username} 
                        createdAt={message?.createdAt} 
                        body={message?.body} 
                        image={message?.image}
                    />;
                })}
            </div>
            <ChatInput />
        </div>
    );
};