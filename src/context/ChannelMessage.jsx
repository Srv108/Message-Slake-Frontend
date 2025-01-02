import { createContext, useState } from 'react';

const ChannelMessage = createContext();

export const ChannelMessageProvider = ({ children }) => {

    const [messageList, setMessageList] = useState([]);
    return (
        <ChannelMessage.Provider value={{ messageList, setMessageList }}>
            { children }
        </ChannelMessage.Provider>
    );
};
export default ChannelMessage;