import { useContext } from 'react';

import WorkspaceCreateContext from '@/context/WorkspaceCreateContext';

export const useWorkspaceCreateModal = () => {
    return useContext(WorkspaceCreateContext);
};