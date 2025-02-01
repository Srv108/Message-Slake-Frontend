import { createContext, useState } from 'react';

import { useAuth } from '@/hooks/context/useAuth';

const RoomDetailsContext = createContext();

export const RoomDetailsProvider = ({ children }) => {
    
    const [ currentRoom, setCurrentRoom ] = useState(null);
    const [ recieverId, setRecieverId ] = useState(null);
    const [ senderId, setSenderId ] = useState(null);
    const [ openDrawer, setOpenDrawer ] = useState(false);

    const { auth } = useAuth();
    
    function setMemberDetail(reciever,sender){
        const userId = auth?.user?.id;
        if( userId.toString() === reciever.toString()){
            setRecieverId(sender);
        }else{
            setRecieverId(reciever);
        }
    }

    return (
        <RoomDetailsContext.Provider value={{ 
            currentRoom, 
            setCurrentRoom, 
            recieverId, 
            setRecieverId, 
            senderId, 
            setSenderId,
            openDrawer,
            setOpenDrawer,
            setMemberDetail 
        }} >
            { children }
        </RoomDetailsContext.Provider>
    );
};

export default RoomDetailsContext;