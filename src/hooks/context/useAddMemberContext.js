import { useContext } from 'react';

import AddMemberWorkspaceContext from '@/context/AddMemberWorkspace';

export const useAddMemberContext = () => {
    return useContext(AddMemberWorkspaceContext);
};