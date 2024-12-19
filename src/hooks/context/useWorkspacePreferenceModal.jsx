import { useContext } from 'react';

import WorkspacePreferenceContext from '@/context/WorkspacePreferencesContext';

export const useWorkspacePreferenceModal = () => {

    return useContext(WorkspacePreferenceContext);
};