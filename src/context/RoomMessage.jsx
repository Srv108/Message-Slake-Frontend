import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchRoomMessageRequest } from '@/api/room';
import { useAuth } from '@/hooks/context/useAuth';

const RoomMessageContext = createContext();

export const RoomMessageProvider = ({ children }) => {
    const [roomMessages, setRoomMessages] = useState({});
    const [currentRoomMessages, setCurrentRoomMessages] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const {roomId: currentParamsRoomId} = useParams();
    const {auth} = useAuth();

    // 🔹 Track ongoing fetches to prevent duplicate requests
    const isFetchingRoomsRef = useRef({});

    // ======================================================
    // 🔹 Log whenever roomMessages changes
    // ======================================================
    useEffect(() => {
        console.log('🗂️ RoomMessage Map Updated:', JSON.parse(JSON.stringify(roomMessages)));
    }, [roomMessages, currentRoomMessages]);

    useEffect(() => {
        console.log('🧭 Current Room ID:', currentRoomId);
        console.log('💬 Current Room Messages:', currentRoomMessages);
    }, [currentRoomId, currentRoomMessages]);

    // ======================================================
    // 🔹 Set the active room and sync its messages from the db -> its for first time load
    //  /* 
    //         first update the ui messages by setCurrentRoomMessages by fetched message from db
    //         then update the maps by setRoomMessages
    //  */
    // ======================================================
    const setCurrentRoom = useCallback((roomId, Messages) => {
        if (!roomId) {
            console.warn('⚠️ [RoomMessage] setCurrentRoom called with no roomId');
            return;
        }

        console.log(`🏠 [RoomMessage] Switching to Room: ${roomId}`);

        // Always update the current room ID first
        setCurrentRoomId(roomId);

        // If roomMessages object isn't ready yet, initialize it
        if (!roomMessages || typeof roomMessages !== 'object') {
            console.warn('⚠️ [RoomMessage] roomMessages is not initialized yet');
            setCurrentRoomMessages([]);
            return;
        }

        // 🧠 If we have cached messages, use them immediately
        const cachedMessages = roomMessages?.[roomId];
        if (Array.isArray(cachedMessages) && cachedMessages.length > 0) {
            console.log(`✅ [RoomMessage] Using ${cachedMessages.length} cached messages for Room:`, roomId);
            setCurrentRoomMessages(cachedMessages);
            return;
        }

        // 🆕 If we have new messages (from DB fetch), use them
        if (Array.isArray(Messages)) {
            console.log(`🆕 [RoomMessage] Setting ${Messages.length} messages for Room:`, roomId);
            setCurrentRoomMessages(Messages);

            // Update the cache safely
            setRoomMessages(prev => {
                const newState = { ...(prev || {}), [roomId]: Messages };
                console.log('💾 [RoomMessage] Updated message store with new room:', {
                    roomId,
                    messageCount: Messages.length,
                    allRooms: Object.keys(newState)
                });
                return newState;
            });
        } else {
            // 🧹 Clear stale messages if no data provided
            console.log('🧹 [RoomMessage] No messages provided or cached, clearing current messages');
            setCurrentRoomMessages([]);
        }
    }, [roomMessages, setRoomMessages, setCurrentRoomId, setCurrentRoomMessages]);


    // ======================================================
    // 🔹 Add message to ANY room (socket incoming messages) -> handle only socket message ......
    //  /* 
    //         then update the ui messages by setCurrentRoomMessages if current room is active otherwise do update maps directly
    //         then update the maps by setRoomMessages
    
    //         attention this will only used for socket coming message.....
    //  */
    // ======================================================
    const addMessageToRoom = useCallback(async (message) => {
        const roomId = message.roomId;
        console.log(`📩 New message received for Room ${roomId}:`, message);

        console.log('currentRoomId', currentRoomId);
        console.log('currentParamsRoomId', currentParamsRoomId);

        /* first check coming roomId already initialised inside the roomMessages 
            if not then first fetch messages from db and then update the ui messages and then maps
            else update the ui messages and maps
        */

        if (!roomMessages[roomId] && currentRoomId && currentRoomId.toString() !== roomId.toString() && !isFetchingRoomsRef.current[roomId]) {
            console.log(`Room ${roomId} not initialized yet. Skipping message.`);
            isFetchingRoomsRef.current[roomId] = true;
            try {
                const fetchedMessages = await fetchRoomMessageRequest({roomId, limit: 100, offset: 0, token: auth?.token || auth?.user?.token});
                /* update the message with the all fetched message */
                setRoomMessages(prev => {
                    const newState = { ...prev, [roomId]: [...fetchedMessages, message] };
                    console.log('💾 Updated RoomMessage Map (after addMessageToRoom):', JSON.parse(JSON.stringify(newState)));
                    return newState;
                });
            } finally {
                isFetchingRoomsRef.current[roomId] = false;
            }
            return;
        }

        /* if the coming socket message is of current active room then update the ui messages 
            since here we are confirmed that db message is already fetched and stored inside the roomMessages
            because db message fetched first time when we switch to the room
        */

        if ((currentRoomId && currentRoomId.toString() === roomId.toString()) ||
            (currentParamsRoomId && currentParamsRoomId.toString() === roomId.toString())) {
                console.log('currentRoomId', currentRoomId);
                console.log('currentParamsRoomId', currentParamsRoomId);
                console.log('📺 Updating UI (current room is active)');
                setCurrentRoomMessages(prev => [...prev, message]);
        }

        /*  
            update the maps 
            update the current active room messages also
            this will also handle the coming socket id that is already stored inside the roomMessages and are not of current active room
        */
        setRoomMessages(prev => {
            const existing = prev[roomId] || [];
            const newRoomMessages = [...existing, message];
            const newState = { ...prev, [roomId]: newRoomMessages };
            console.log('💾 Updated RoomMessage Map (after addMessageToRoom):', JSON.parse(JSON.stringify(newState)));
            return newState;
        });
    }, [currentRoomId, currentParamsRoomId, roomMessages]);

    // ======================================================
    // 🔹 Add message to CURRENT room (UI send) handle message when we send message from the ui
    //  /* 
    //         first update the ui messages         ---------- 1
    //         then update the maps                 ---------- 2
    //  */
    // ======================================================
    const addMessageToCurrentRoom = useCallback((message) => {
        const roomId = message?.roomId;
        if (!currentRoomId) return;
        console.log(`🧭 Adding message to current active Room (${currentRoomId}):`, message);
        setCurrentRoomMessages(prev => [...prev, message]);

        /* update the maps */
        setRoomMessages(prev => {
            const existing = prev[roomId] || [];
            const newRoomMessages = [...existing, message];
            const newState = { ...prev, [roomId]: newRoomMessages };
            console.log('💾 Updated RoomMessage Map (after addMessageToRoom):', JSON.parse(JSON.stringify(newState)));
            return newState;
        });
    }, [currentRoomId, setCurrentRoomMessages, addMessageToRoom]);

    // ======================================================
    // 🔹 Utilities
    // ======================================================
    const isRoomInitialized = useCallback(roomId => Boolean(roomMessages[roomId]), [roomMessages]);
    const isCurrentRoom = useCallback(roomId => currentRoomId === roomId, [currentRoomId]);
    const isRoomMessageHasRoomID = useCallback(roomId => Boolean(roomMessages[roomId]), [roomMessages]);
    return (
        <RoomMessageContext.Provider value={{
            roomMessages,
            currentRoomMessages,
            currentRoomId,
            setCurrentRoom,
            addMessageToCurrentRoom,
            addMessage: addMessageToRoom,
            checkRoomMessageHasRoomID: isRoomMessageHasRoomID,
            isRoomInitialized,
            isCurrentRoom,
        }}>
            {children}
        </RoomMessageContext.Provider>
    );
};

export default RoomMessageContext;
