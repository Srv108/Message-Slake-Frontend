import { createContext, useState } from 'react';
const AddMemberWorkspaceContext = createContext();

export const AddMemberWorkspaceContextProvider = ({ children }) => {

    const [ openAddMemberModal, setOpenAddMemberModal ] = useState(false);
    const [ formSubmitHandler, setFormSubmitHandler ] = useState(null);
    const [ isPending, setIsPending ] = useState(false);

    return (
        <AddMemberWorkspaceContext.Provider value={{ 
            openAddMemberModal, 
            setOpenAddMemberModal,
            formSubmitHandler,
            setFormSubmitHandler,
            isPending,
            setIsPending
        }} >
            {children}
        </AddMemberWorkspaceContext.Provider>
    );
};
export default AddMemberWorkspaceContext;