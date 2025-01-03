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
    const queryClient = useQueryClient();
    const { isFetching, channelsDetails, isError } = useGetChannelById(channelId);

    const { joinChannel } = useSocket();
    const { messageList, setMessageList } = useChannelMessage();

    const { 
        isSuccess, 
        channelMessages 
    } = useGetChannelMessage(channelId);

    const messageContainerListRef = useRef(null);

    const scrollToBottom = () => {
        if (messageContainerListRef.current) {
            messageContainerListRef.current.scrollTop = messageContainerListRef?.current?.scrollHeight;
        }
    };
    
    useEffect(() => {
        scrollToBottom();
    },[messageList,isSuccess]);

    useEffect(() => {
        queryClient.invalidateQueries('getChannelMessages');
        scrollToBottom();
    }, [channelId,queryClient]);

    useEffect(() => {
        if(isSuccess){
            setMessageList(channelMessages);
            scrollToBottom();
        }
    }, [isSuccess,channelMessages,setMessageList,channelId]);

    useEffect(() => {
        if(!isFetching && !isError){
            joinChannel(channelId);
            scrollToBottom();
        }
    },[isFetching,isError,channelId,joinChannel,channelsDetails]);



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
                    />;
                })}
            </div>
            <ChatInput />
        </div>
    );
};