import { createContext, useState } from 'react';

const WorkspaceCreateContext = createContext();

export const WorkspaceCreateProvider = ({ children }) => {

    const [openWorkspaceCreateModal, setOpenWorkspaceCreateModal] = useState(false);
    
    return (
        <WorkspaceCreateContext.Provider value={{ openWorkspaceCreateModal, setOpenWorkspaceCreateModal }}>
            {children}
        </WorkspaceCreateContext.Provider>
    );
};
export default WorkspaceCreateContext;