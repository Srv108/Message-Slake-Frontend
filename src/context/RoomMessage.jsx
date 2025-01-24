import { createContext, useState } from 'react';

const RoomMessageContext = createContext();

export const RoomMessageProvider = ({ children }) => {

    const [ roomMessageList, setRoomMessageList ] = useState([]);
    return (
        <RoomMessageContext.Provider value={{ roomMessageList, setRoomMessageList }}>
            { children }
        </RoomMessageContext.Provider>
    );
};

export default RoomMessageContext;