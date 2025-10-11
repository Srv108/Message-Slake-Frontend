import { createContext, useState } from 'react';

const CreateChannelContext = createContext();

export const CreateChannelContextProvider = ({ children }) => {

    const [openCreateChannelModal, setOpenCreateChannelModal] = useState(false);
    const [targetWorkspaceId, setTargetWorkspaceId] = useState(null);

    return (
        <CreateChannelContext.Provider value={{ openCreateChannelModal, setOpenCreateChannelModal, targetWorkspaceId, setTargetWorkspaceId }} >
            {children}
        </CreateChannelContext.Provider>
    );
};
export default CreateChannelContext;