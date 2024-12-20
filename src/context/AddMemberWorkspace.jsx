import { createContext, useState } from 'react';
const AddMemberWorkspaceContext = createContext();

export const AddMemberWorkspaceContextProvider = ({ children }) => {

    const [ openAddMemberModal, setOpenAddMemberModal ] = useState(false);

    return (
        <AddMemberWorkspaceContext.Provider value={{ openAddMemberModal, setOpenAddMemberModal }} >
            {children}
        </AddMemberWorkspaceContext.Provider>
    );
};
export default AddMemberWorkspaceContext;