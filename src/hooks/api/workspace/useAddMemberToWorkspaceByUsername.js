import { useMutation } from '@tanstack/react-query';

import { addMemberToWorkspaceByUsernameRequest } from '@/api/workspace';
import { useAuth } from '@/hooks/context/useAuth';
import { useWorkspace } from '@/hooks/context/useWorkspace';

export const useAddMemberToWorkspaceByUsername = () => {

    const { auth } = useAuth();
    const { currentWorkspace } = useWorkspace();
    const { isPending, isSuccess, error, mutateAsync: addMemberToWorkspaceByUsernameMutation} = useMutation({
        mutationFn: (username) => addMemberToWorkspaceByUsernameRequest({
            workspaceId: currentWorkspace?._id,
            username: username,
            token: auth?.token
        }),
        onError: (error) => {
            console.log('Error coming from add member workspace by username hook',error);
        },
        onSuccess: (response) => {
            console.log('User successfully joined the workspace',response);
        }
    });

    return {
        error,
        isPending,
        isSuccess,
        addMemberToWorkspaceByUsernameMutation
    };
};