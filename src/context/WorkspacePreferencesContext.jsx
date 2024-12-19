import { createContext, useState } from 'react';

const WorkspacePreferenceContext = createContext();

export const WorkspacePreferenceProvider = ({ children }) => {

    const [openWorkspacePreference, setOpenWorkspacePreference] = useState(false);

    const [initialValue, setInitialValue] = useState('Edit Workspace');
    return(
        <WorkspacePreferenceContext.Provider value={{ openWorkspacePreference, setOpenWorkspacePreference, initialValue, setInitialValue }}>
            {children}
        </WorkspacePreferenceContext.Provider>
    );
};

export default WorkspacePreferenceContext;