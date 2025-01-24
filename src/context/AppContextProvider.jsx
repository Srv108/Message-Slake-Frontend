
import combineContext from '@/utils/combineContext';

import { AcceptFileContexProvider } from './AcceptFileContext';
import { AddMemberWorkspaceContextProvider } from './AddMemberWorkspace';
import { AuthContextProvider } from './AuthContext';
import { ChannelMessageProvider } from './ChannelMessage';
import { CreateChannelContextProvider } from './CreateChannelContext';
import { RoomDetailsProvider } from './RoomDetailsContext';
import { RoomMessageProvider } from './RoomMessage';
import { SocketContextProvider } from './SocketContex';
import { UserProfileContextProvider } from './UserProfileContext';
import { WorkspaceContextProvider } from './WorkspaceContext';
import { WorkspaceCreateProvider } from './WorkspaceCreateContext';
import { WorkspacePreferenceProvider } from './WorkspacePreferencesContext';

export const AppContextProvider = combineContext(
    ChannelMessageProvider,
    RoomMessageProvider,
    RoomDetailsProvider,
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
