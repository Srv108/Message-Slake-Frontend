import { createContext, useState } from 'react';

const RoomDetailsContext = createContext();

export const RoomDetailsProvider = ({ children }) => {
    
    const [ currentRoom, setCurrentRoom ] = useState(null);
    const [ recieverId, setRecieverId ] = useState(null);
    const [ senderId, setSenderId ] = useState(null);

    return (
        <RoomDetailsContext.Provider value={{ currentRoom, setCurrentRoom, recieverId, setRecieverId, senderId, setSenderId }} >
            { children }
        </RoomDetailsContext.Provider>
    );
};

export default RoomDetailsContext;