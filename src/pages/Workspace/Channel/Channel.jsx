import { Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ChatInput } from '@/components/atoms/ChatInput/ChatInput';
import { ChannelDetailsDrawer } from '@/components/molecules/Channel/ChannelDetailsDrawer';
import { ChannelHeader } from '@/components/molecules/Channel/ChannelHeader';
import { Message } from '@/components/molecules/Message/Message';
import { Button } from '@/components/ui/button';
import { useGetChannelById } from '@/hooks/api/channel/useGetChannelById';
import { useChannelMessage } from '@/hooks/context/useChannelMessage';
import { useChatTheme } from '@/hooks/context/useChatTheme';
import { useSocket } from '@/hooks/context/useSocket';
import { seperateTimeFormat } from '@/utils/formatTime/seperator';

export const Channel = () => {

    const { channelId, workspaceId } = useParams();
    const safeChannelId = channelId?.toString();

    // local refs/state
    const lastTimeSeparatorRef = useRef('');
    const hasLoadedMessages = useRef(false);
    const lastJoinedChannelRef = useRef(null);
    const messageContainerListRef = useRef(null);

    const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // theme/hooks
    const { getCurrentTheme } = useChatTheme();
    const currentTheme = getCurrentTheme();
    const { joinChannel, currentChannel: socketCurrentChannel, isSocketReady } = useSocket();
    const { currentChannelMessages, setCurrentChannel } = useChannelMessage();

    // api hooks
    const { channelsDetails, isFetching: detailsFetching, isError: detailsError } = useGetChannelById(safeChannelId);

const scrollToBottom = (smooth = false) => {
        if (!messageContainerListRef.current) return;
        messageContainerListRef.current.scrollTo({
            top: messageContainerListRef.current.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto',
        });
    };

    const isNearBottom = (threshold = 200) => {
        const el = messageContainerListRef.current;
        if (!el) return true;
        return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    };

    useEffect(() => {
        if (currentChannelMessages?.length && isNearBottom()) scrollToBottom(true);
    }, [currentChannelMessages]);

    // Join channel via socket when channelId is available and socket is ready
    useEffect(() => {
        if (!channelId) {
            console.warn('⚠️ No channelId available');
            return;
        }

        if (!isSocketReady) {
            console.warn('⚠️ Socket not ready, waiting...');
            return;
        }

        // Prevent duplicate joins - check both socket state and our ref
        if (socketCurrentChannel === channelId || lastJoinedChannelRef.current === channelId) {
            console.log('ℹ️ Already in channel:', channelId);
            return;
        }

        console.log('🚪 Joining channel via socket:', channelId);
        joinChannel(channelId);
        lastJoinedChannelRef.current = channelId;
    }, [channelId, isSocketReady, socketCurrentChannel, joinChannel]);

    // Reset and clear messages when channel changes ONLY
    useEffect(() => {
        if (!channelId) {
            console.log('[Channel] No channelId, skipping reset');
            return;
        }
        
        console.log('\n🔄 ========== CHANNEL CHANGE ==========');
        console.log('📍 New Channel ID:', channelId);
        console.log('🏢 Workspace ID:', workspaceId);

        // 🟢 FIX: do not immediately wipe UI to empty — set placeholder & reset flags
        lastTimeSeparatorRef.current = '';
        hasLoadedMessages.current = false;
        setIsLoadingMessages(true);

        // show previous messages (if any) while new ones are fetched, to avoid UI flash
        // we pass [] as Messages so provider sets an empty array only if no cache exist
        setCurrentChannel(workspaceId, channelId, currentChannelMessages || []);

        console.log('🧹 [Channel] Set current channel context (placeholder). Waiting for fetch...');
        console.log('==================================================\n');
    }, [channelId, workspaceId, setCurrentChannel]);

    // render states for fetch/errors
    if (detailsFetching) {
        return (
            <div className='h-full flex-1 flex items-center justify-center'>
                <Loader2Icon className='size-5 animate-spin text-muted-foreground' />
            </div>
        );
    }

    if (detailsError || !channelsDetails) {
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
                {currentChannelMessages?.map((message) => {
                    
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