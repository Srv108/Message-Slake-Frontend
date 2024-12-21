import { createContext, useState } from 'react';

const ConfirmModalContext = createContext();

export const ConfirmModalContextProvider = ({ children }) => {

    const [openConfirmModal,setOpenConfirmModal] = useState(false);
    const [confirmation,setConfirmation] = useState(false);

    return (
        <ConfirmModalContext.Provider value={{ confirmation, setConfirmation, openConfirmModal, setOpenConfirmModal }} >
            { children }
        </ConfirmModalContext.Provider>
    );
};
export default ConfirmModalContext;