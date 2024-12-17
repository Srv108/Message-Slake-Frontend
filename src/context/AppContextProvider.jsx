
import combineContext from '@/utils/combineContext';

import { AuthContextProvider } from './AuthContext';
import { WorkspaceCreateProvider } from './WorkspaceCreateContext';

export const AppContextProvider = combineContext(
    AuthContextProvider,
    WorkspaceCreateProvider,
);
