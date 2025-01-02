import { createContext, useState } from 'react';
import { io } from 'socket.io-client';

import { useChannelMessage } from '@/hooks/context/useChannelMessage';

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {

    const [ currentChannel, setCurrentChannel ] = useState(null); 
    const { messageList, setMessageList } = useChannelMessage();

    const socket = io(import.meta.env.VITE_BACKEND_SOCKET_URL);

    socket.on('NewMessageReceived',(data)=>{
        console.log('New message recieved ',data);
        setMessageList([...messageList,data]);
        console.log(messageList);
    });

    async function joinChannel (channelId){
        socket.emit('JoinChannel',{ channelId },(data) => {
            console.log('successfully joined the channel', data);
            setCurrentChannel(data?.data);
        });
    }

    return (
        <SocketContext.Provider value={{ socket, joinChannel, currentChannel, }} >
            { children }
        </SocketContext.Provider>
    );
};

export default SocketContext;