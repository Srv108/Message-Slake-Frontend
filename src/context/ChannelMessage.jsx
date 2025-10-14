import { createContext, useCallback, useEffect, useRef, useState } from 'react';

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
    const setCurrentChannelContext = useCallback(async (workspaceId, channelId, Messages) => {
        console.log(`📡 Switching to Channel: Workspace(${workspaceId}) → Channel(${channelId})`);
        setCurrentChannel({ workspaceId, channelId });

        if (channelMessages[workspaceId]?.[channelId] && channelMessages[workspaceId]?.[channelId].length > 0) {
            console.log('✅ Cached messages found for Channel:', channelId);
            setCurrentChannelMessages(channelMessages[workspaceId][channelId]);
            return;
        }

        console.log('🆕 No cache found → Using fetched DB messages for Channel:', channelId);
        setCurrentChannelMessages(Messages);
        setChannelMessages(prev => {
            const newState = {
                ...prev,
                [workspaceId]: {
                    ...prev[workspaceId],
                    [channelId]: Messages,
                },
            };
            console.log('💾 Updated ChannelMessage Map (after setCurrentChannel):', JSON.parse(JSON.stringify(newState)));
            return newState;
        });
    }, [channelMessages]);

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

        if ((!channelMessages[workspaceId] || !channelMessages[workspaceId][channelId])
            && currentChannel.workspaceId !== workspaceId
            && currentChannel.channelId !== channelId
        ) {
            console.log('Room not initialized yet. Fetching previous channel messages from DB');
            isFetchingChannelsRef.current[channelId] = true;
            try {
                const fetchedMessages = await getPaginatedMessageRequest({ channelId, limit: 100, offset: 0, token: auth?.token || auth?.user?.token});
                /* update the message with the all fetched message */
                setChannelMessages(prev => {
                    const workspace = prev[workspaceId] || {};
                    const newState = { ...prev, [workspaceId]: { workspace, [channelId]: [...fetchedMessages, message] } };
                    console.log('💾 Updated ChannelMessage Map (after addMessageToChannel):', JSON.parse(JSON.stringify(newState)));
                    return newState;
                });
            } finally {
                isFetchingChannelsRef.current[channelId] = false;
            }
            return;
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
            here we already confirmed that current channel is already stored inside the channelMessages
            so we are updating the maps only
        */

        setChannelMessages(prev => {
            const newState = {
                ...prev,
                [workspaceId]: {
                    ...prev[workspaceId],
                    [channelId]: [...prev[workspaceId][channelId], message],
                },
            };

            console.log('💾 Updated ChannelMessage Map (after addMessageToChannel):', JSON.parse(JSON.stringify(newState)));
            return newState;
        });
    }, [currentChannel]);

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
            const newState = {
                ...prev,
                [currentChannel.workspaceId]: {
                    ...prev[currentChannel.workspaceId],
                    [currentChannel.channelId]: [...prev[currentChannel.workspaceId][currentChannel.channelId], message]
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


    // ======================================================
    // 🔹 Add message to current channel (UI-active one)
    // ======================================================
    // const addMessageToCurrentChannel = useCallback((message) => {
    //     if (
    //         !currentChannel.workspaceId ||
    //         !currentChannel.channelId ||
    //         currentChannel.workspaceId !== message.workspaceId ||
    //         currentChannel.channelId !== message.channelId
    //     ) return;

    //     // Add message to UI list
    //     setCurrentChannelMessages(prev => [...prev, message]);

    //     // Also update the full map
    //     addMessageToChannel(message);
    // }, [currentChannel, addMessageToChannel]);


    return (
        <ChannelMessage.Provider
            value={{
                channelMessages,
                currentChannelMessages,
                currentChannel,
                setCurrentChannel: setCurrentChannelContext,
                addMessage: addMessageToChannel,
                addMessageToCurrentChannel,
                isWorkspaceInitialized,
                isChannelInitialized,
            }}
        >
            {children}
        </ChannelMessage.Provider>
    );
};

export default ChannelMessage;
