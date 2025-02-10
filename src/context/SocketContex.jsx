import { useQueryClient } from '@tanstack/react-query';
import { createContext, useState } from 'react';
import { io } from 'socket.io-client';

import { useChannelMessage } from '@/hooks/context/useChannelMessage';
import { useRoomDetails } from '@/hooks/context/useRoomDetails';
import { useRoomMessage } from '@/hooks/context/useRoomMessage';

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {

    const queryClient = useQueryClient();
    const [ currentChannel, setCurrentChannel ] = useState(null); 
    const { messageList, setMessageList } = useChannelMessage();
    const { roomMessageList, setRoomMessageList } = useRoomMessage();
    const { currentRoom, setCurrentRoom } = useRoomDetails();

    const socket = io(import.meta.env.VITE_BACKEND_SOCKET_URL);

    socket.on('NewMessageReceived',(data)=>{
        console.log('New message recieved ',data);
        setMessageList((prevList) => [...prevList, data]);
        queryClient.invalidateQueries('getChannelMessages');
        console.log(messageList);
    });

    socket.on('roomMessageRecieved',(data)=>{
        console.log('New message recieved in the room',data);
        setRoomMessageList((prevList) => [...prevList, data]);
        queryClient.invalidateQueries('fetchRoomMessages');
        console.log(roomMessageList);
    });

    async function joinRoom (roomId){
        if(roomId !== currentRoom){
            socket.emit('joinRoom',{ roomId},(data)=>{
                console.log('successfully joined room',data);
                setCurrentRoom(data?.data);
            });
        }
    }

    async function joinChannel (channelId){
        if(channelId !== currentChannel){
            socket.emit('JoinChannel',{ channelId },(data) => {
                console.log('successfully joined the channel', data);
                setCurrentChannel(data?.data);
            });
        }
    }

    return (
        <SocketContext.Provider value={{ socket , joinChannel, currentChannel, joinRoom }} >
            { children }
        </SocketContext.Provider>
    );
};

export default SocketContext;