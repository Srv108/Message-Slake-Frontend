import { useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ChatInput } from '@/components/atoms/ChatInput/ChatInput';
import { ChannelDetailsDrawer } from '@/components/molecules/Channel/ChannelDetailsDrawer';
import { ChannelHeader } from '@/components/molecules/Channel/ChannelHeader';
import { Message } from '@/components/molecules/Message/Message';
import { Button } from '@/components/ui/button';
import { useGetChannelById } from '@/hooks/api/channel/useGetChannelById';
import { useGetChannelMessage } from '@/hooks/api/channel/useGetChannelMessage';
import { useChannelMessage } from '@/hooks/context/useChannelMessage';
import { useChatTheme } from '@/hooks/context/useChatTheme';
import { useSocket } from '@/hooks/context/useSocket';
import { seperateTimeFormat } from '@/utils/formatTime/seperator';

export const Channel = () => {

    const { channelId } = useParams();
    const hasJoinedChannel = useRef(false); 
    const lastTimeSeparatorRef = useRef('');
    const queryClient = useQueryClient();
    const safeChannelId = channelId?.toString();
    const { isFetching, channelsDetails, isError } = useGetChannelById(safeChannelId);

    const { joinChannel, currentChannel: socketCurrentChannel, socket } = useSocket();
    const { messageList, setMessageList } = useChannelMessage();
    const { getCurrentTheme } = useChatTheme();
    const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
    
    const currentTheme = getCurrentTheme();

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

    // Only invalidate when switching channels, not on every render
    useEffect(() => {
        if (channelId) {
            queryClient.invalidateQueries('getChannelMessages');
            scrollToBottom();
        }
    }, [channelId, queryClient]);

    useEffect(() => {
        console.log('🔍 Channel useEffect triggered:');
        console.log('  - channelId:', channelId);
        console.log('  - socketCurrentChannel:', socketCurrentChannel);
        console.log('  - hasJoinedChannel.current:', hasJoinedChannel.current);
        console.log('  - socket exists:', !!socket);
        console.log('  - socket.connected:', socket?.connected);
        
        // Only join if channel changed and socket is ready
        if (channelId && channelId !== socketCurrentChannel && !isFetching && !isError) {
            console.log('🚪 Joining new channel:', channelId);
            joinChannel(channelId);
            scrollToBottom();
            hasJoinedChannel.current = true;
        } else if (channelId === socketCurrentChannel) {
            console.log('✅ Already in channel:', channelId);
            hasJoinedChannel.current = true;
        }

        return () => {
            console.log('🧹 Channel cleanup');
            // Don't reset hasJoinedChannel - causes re-joining issues
        };
    },[isFetching, isError, channelId, socketCurrentChannel, socket, joinChannel]);

    // Only load initial messages once when channel changes
    const hasLoadedMessages = useRef(false);
    
    useEffect(() => {
        if (isSuccess && channelMessages && !hasLoadedMessages.current) {
            console.log('📥 Loading initial channel messages:', channelMessages.length);
            setMessageList(channelMessages);
            scrollToBottom();
            hasLoadedMessages.current = true;
        }
    }, [isSuccess, channelMessages, setMessageList]);

    // Reset hasLoadedMessages when channel changes AND clear old messages
    useEffect(() => {
        console.log('\n🔄 ========== CHANNEL CHANGE EFFECT ==========');
        console.log('  - New channelId:', channelId);
        console.log('  - Clearing old channel messages');
        console.log('  - Resetting hasLoadedMessages flag');
        
        // Clear old messages when switching channels
        setMessageList([]);
        hasLoadedMessages.current = false;
        
        console.log('==================================================\n');
    }, [channelId]);

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
        <div 
            className={`flex flex-col h-full ${currentTheme.background} ${currentTheme.pattern || ''} transition-colors duration-300 relative`}
            style={currentTheme.customBackground ? { backgroundColor: currentTheme.customBackground } : {}}
        >
            <ChannelHeader 
                name={channelsDetails?.name} 
                onOpenDetails={() => setShowDetailsDrawer(true)}
            />
            <div 
                ref={messageContainerListRef} 
                className='h-full overflow-y-auto p-3 sm:p-5 gap-y-2 mb-2 mt-1'
            >
                {messageList?.map((message) => {
                    
                    const separator = seperateTimeFormat(message?.createdAt);
                    const shouldRenderSeparator = lastTimeSeparatorRef.current !== separator;
                    
                    if (shouldRenderSeparator) {
                        lastTimeSeparatorRef.current = separator;
                    } 
                    return (
                        <div key={message?._id}>
                            {shouldRenderSeparator && (
                                <div className='flex justify-center items-center'>
                                    <Button
                                        className="text-center text-gray-700 bg-gray-50 border border-gray-200 my-2 font-medium hover:bg-gray-100 transition-colors rounded-md"
                                    >
                                        {separator}
                                    </Button>
                                </div>
                            )}
                            <Message 
                                authorId={message?.senderId?._id}
                                authorImage={message?.senderId?.avatar} 
                                authorName={message?.senderId?.username} 
                                createdAt={message?.createdAt} 
                                body={message?.body} 
                                image={message?.image}
                            />
                        </div>
                    );
                })}
            </div>
            <ChatInput />

            {/* Channel Details Drawer */}
            <ChannelDetailsDrawer
                open={showDetailsDrawer}
                channel={channelsDetails}
                onClose={() => setShowDetailsDrawer(false)}
            />
        </div>
    );
};