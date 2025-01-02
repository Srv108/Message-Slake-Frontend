import { useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { ChatInput } from '@/components/atoms/ChatInput/ChatInput';
import { ChannelHeader } from '@/components/molecules/Channel/ChannelHeader';
import { Message } from '@/components/molecules/Message/Message';
// import { ScrollArea } from '@/components/ui/scroll-area';
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
    const { isSuccess, channelMessages } = useGetChannelMessage(channelId);

    const messageContainerListRef = useRef(null);

    useEffect(() => {
        if(messageContainerListRef.current){
            console.log('scroll height is ',messageContainerListRef.current.scrollHeight);
            messageContainerListRef.current.scrollTop = messageContainerListRef.current.scrollHeight;        }
    },[messageList]);

    useEffect(() => {
        queryClient.invalidateQueries('getChannelMessages');
    }, [channelId,queryClient]);

    useEffect(() => {
        if(isSuccess){
            console.log('message recieved is ',channelMessages);
            setMessageList(channelMessages);
        }
    }, [isSuccess,channelMessages,setMessageList,channelId]);

    useEffect(() => {
        if(!isFetching && !isError){
            console.log('ready to join channel',channelsDetails);
            joinChannel(channelId);
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
        <div className='flex flex-col h-full'>
            <ChannelHeader name={channelsDetails?.name} />
            <div 
                ref={messageContainerListRef} 
                className='h-full overflow-y-auto p-5 gap-y-2'
            >
                {messageList?.map((message) => {
                    return <Message 
                        key={message?._id} 
                        authorImage={message?.senderId?.avatar} 
                        authorName={message?.senderId?.username} 
                        createdAt={message?.createdAt} 
                        body={message.body} 
                    />;
                })}
            </div>
            <ChatInput />
        </div>
    );
};