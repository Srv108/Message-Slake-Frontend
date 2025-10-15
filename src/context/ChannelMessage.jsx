import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getPaginatedMessageRequest } from '@/api/channel';
import { useAuth } from '@/hooks/context/useAuth';

const ChannelMessage = createContext();

export const ChannelMessageProvider = ({ children }) => {
    const [channelMessages, setChannelMessages] = useState({});
    const [currentChannelMessages, setCurrentChannelMessages] = useState([]);
    const [currentChannel, setCurrentChannel] = useState({ workspaceId: null, channelId: null });

    // 🔹 Track ongoing fetches to prevent duplicate requests
    const isFetchingChannelsRef = useRef({});

    const {auth} = useAuth();

    const handleFetchDBMessages = useCallback(async({workspaceId, channelId}) => {
        if (!workspaceId || !channelId) return [];
        if (isFetchingChannelsRef.current[channelId]) return [];

        isFetchingChannelsRef.current[channelId] = true;

        try {
            const fetchedMessages = await getPaginatedMessageRequest({ channelId, limit: 100, offset: 0, token: auth?.token || auth?.user?.token });

            setChannelMessages(prev => {
                const workspace = prev[workspaceId] || {};
                const newState = { 
                    ...prev, 
                    [workspaceId]: { ...workspace, [channelId]: fetchedMessages || [] } 
                };
                console.log('💾 Updated ChannelMessage Map (after addMessageToChannel):', JSON.parse(JSON.stringify(newState)));
                return newState;
            });

            return fetchedMessages;
        } catch (err) {
            console.error(`❌ Failed to fetch messages for Channel ${channelId}:`, err);
            return [];
        } finally {
            isFetchingChannelsRef.current[channelId] = false;
        }
    }, [auth]);

    // ======================================================
    // 🔹 Log whenever channelMessages changes
    // ======================================================
    useEffect(() => {
        console.log('🗂️ ChannelMessage Map Updated:', JSON.parse(JSON.stringify(channelMessages)));
    }, [channelMessages]);

    useEffect(() => {
        console.log('🧭 Current Channel:', currentChannel);
        console.log('💬 Current Channel Messages:', currentChannelMessages);
    }, [currentChannel, currentChannelMessages]);

    // ======================================================
    // 🔹 Set current channel context -> Attention use this only for first time load

        /* this will handle workspace / channel switch first time load
        */
    // ======================================================
    const setCurrentChannelContext = useCallback(async (workspaceId, channelId) => {
        // Don't update if we're already on this channel
        if (currentChannel.workspaceId === workspaceId && currentChannel.channelId === channelId) {
            console.log('ℹ️ Already on the same channel, skipping update');
            return;
        }

        console.log(`📡 Switching to Channel: Workspace(${workspaceId}) → Channel(${channelId})`);
        
        // First update the current channel reference
        setCurrentChannel(prev => ((prev.workspaceId === workspaceId && prev.channelId === channelId) ? prev : { workspaceId, channelId }));

        /* clear the current channel message immediatly */
        setCurrentChannelMessages([]);

        /* if we have cached messages, use them */
        const cachedMessages = channelMessages?.[workspaceId]?.[channelId];
        if (Array.isArray(cachedMessages) && cachedMessages.length > 0) {
            console.log(`✅ Using ${cachedMessages.length} cached messages for Channel:`, channelId);
            setCurrentChannelMessages(cachedMessages);
            return;
        }

        /* if we have new messages (from DB fetch), use them */
        const newMessages = await handleFetchDBMessages({workspaceId, channelId});
        console.log('newMessages fetched from db', newMessages);
        setCurrentChannelMessages(newMessages);
        
    }, [channelMessages, handleFetchDBMessages]);

    // ======================================================
    // 🔹 Add message to ANY workspace/channel (socket incoming) -> Attention use this only for socket message
        /*  Cases we need to consider here
            1. if the coming message is of current active channel then update the ui messages and also update the maps
                since here we are confirmed that db message is already fetched and stored inside the channelMessages
                because db message fetched first time when we switch to the channel
            
            2. if the coming message is not of current active channel then first fetch the previous channel message from db
                then update the ui messages and maps
            
            3. if the coming message is not of current active channel but this channel id is already stored inside the channelMessages
                then update the maps only
        */
    // ======================================================
    const addMessageToChannel = useCallback(async(message) => {
        const workspaceId = message.workspaceId;
        const channelId = message.channelId;

        console.log(`📨 New message received for Workspace(${workspaceId}) → Channel(${channelId}):`, message);

        /* first handle case 2 */

        if ((!channelMessages[workspaceId]?.[channelId])
            && !isFetchingChannelsRef.current[channelId]
            && currentChannel.workspaceId !== workspaceId
            && currentChannel.channelId !== channelId
        ) {
            await handleFetchDBMessages({workspaceId, channelId});
        }

        /* handle case 1 */
        if (
            currentChannel.workspaceId === workspaceId &&
            currentChannel.channelId === channelId
        ) {
            console.log('📺 Updating UI (current channel is active)', currentChannel);
            setCurrentChannelMessages(prev => [...prev, message]);
        }

        /* handle case 3  and also update the maps 
            here we already confirmed that current or incoming channel id is already stored inside the channelMessages
            so we are updating the maps only
        */

        setChannelMessages(prev => {
            const prevMessages = prev[workspaceId]?.[channelId] || [];
            const newState = {
                ...prev,
                [workspaceId]: {
                    ...prev[workspaceId],
                    [channelId]: [...prevMessages, message],
                },
            };

            console.log('💾 Updated ChannelMessage Map (after addMessageToChannel):', JSON.parse(JSON.stringify(newState)));
            return newState;
        });
    }, [currentChannel.channelId, currentChannel.workspaceId, channelMessages, handleFetchDBMessages]);

    // ======================================================
    // 🔹 Add message to current channel (UI-active one)
    // ======================================================
    const addMessageToCurrentChannel = useCallback((message) => {
        if (
            !currentChannel.workspaceId ||
            !currentChannel.channelId ||
            currentChannel.workspaceId !== message.workspaceId ||
            currentChannel.channelId !== message.channelId
        ) return;

        // Add message to UI list
        setCurrentChannelMessages(prev => [...prev, message]);

        // Also update the full map
        setChannelMessages(prev => {
            const prevMessages = prev[currentChannel?.workspaceId]?.[currentChannel?.channelId] || [];
            const newState = {
                ...prev,
                [currentChannel.workspaceId]: {
                    ...prev[currentChannel.workspaceId],
                    [currentChannel.channelId]: [...prevMessages, message]
                }
            };
            console.log('💾 Updated ChannelMessage Map (after addMessageToCurrentChannel):', JSON.parse(JSON.stringify(newState)));
            return newState;
        });
    }, [currentChannel]);

    // ======================================================
    // 🔹 Utilities
    // ======================================================
    const isWorkspaceInitialized = useCallback(workspaceId => Boolean(channelMessages[workspaceId]), [channelMessages]);
    const isChannelInitialized = useCallback((workspaceId, channelId) => Boolean(channelMessages[workspaceId]?.[channelId]), [channelMessages]);


    const contextValue = useMemo(() => ({
        channelMessages,
        currentChannelMessages,
        currentChannel,
        setCurrentChannel: setCurrentChannelContext,
        addMessage: addMessageToChannel,
        addMessageToCurrentChannel,
        isWorkspaceInitialized,
        isChannelInitialized,
    }), [channelMessages, currentChannelMessages, currentChannel, setCurrentChannelContext, addMessageToChannel]);

    return (
        <ChannelMessage.Provider
            value={contextValue}
        >
            {children}
        </ChannelMessage.Provider>
    );
};

export default ChannelMessage;
