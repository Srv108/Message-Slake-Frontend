
import combineContext from '@/utils/combineContext';

import { AcceptFileContexProvider } from './AcceptFileContext';
import { AddMemberWorkspaceContextProvider } from './AddMemberWorkspace';
import { AuthContextProvider } from './AuthContext';
import { ChannelMessageProvider } from './ChannelMessage';
import { CreateChannelContextProvider } from './CreateChannelContext';
import { SocketContextProvider } from './SocketContex';
import { UserProfileContextProvider } from './UserProfileContext';
import { WorkspaceContextProvider } from './WorkspaceContext';
import { WorkspaceCreateProvider } from './WorkspaceCreateContext';
import { WorkspacePreferenceProvider } from './WorkspacePreferencesContext';

export const AppContextProvider = combineContext(
    ChannelMessageProvider,
    SocketContextProvider,
    AuthContextProvider,
    WorkspaceCreateProvider,
    WorkspaceContextProvider,
    AcceptFileContexProvider,
    UserProfileContextProvider,
    WorkspacePreferenceProvider,
    CreateChannelContextProvider,
    AddMemberWorkspaceContextProvider,
);
