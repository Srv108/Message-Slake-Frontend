
import combineContext from '@/utils/combineContext';

import { AddMemberWorkspaceContextProvider } from './AddMemberWorkspace';
import { AuthContextProvider } from './AuthContext';
import { CreateChannelContextProvider } from './CreateChannelContext';
import { WorkspaceContextProvider } from './WorkspaceContext';
import { WorkspaceCreateProvider } from './WorkspaceCreateContext';
import { WorkspacePreferenceProvider } from './WorkspacePreferencesContext';

export const AppContextProvider = combineContext(
    AuthContextProvider,
    WorkspaceCreateProvider,
    WorkspaceContextProvider,
    WorkspacePreferenceProvider,
    CreateChannelContextProvider,
    AddMemberWorkspaceContextProvider,
);
