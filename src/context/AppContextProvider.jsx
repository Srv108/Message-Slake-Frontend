
import combineContext from '@/utils/combineContext';

import { AuthContextProvider } from './AuthContext';
import { CreateChannelContextProvider } from './CreateChannelContext';
import { WorkspaceCreateProvider } from './WorkspaceCreateContext';
import { WorkspacePreferenceProvider } from './WorkspacePreferencesContext';

export const AppContextProvider = combineContext(
    AuthContextProvider,
    WorkspaceCreateProvider,
    WorkspacePreferenceProvider,
    CreateChannelContextProvider,
);
