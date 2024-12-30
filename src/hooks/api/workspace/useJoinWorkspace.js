import { useMutation } from '@tanstack/react-query';

import { joinWorkspaceRequest } from '@/api/workspace';
import { useAuth } from '@/hooks/context/useAuth';

export const useJoinWorkspace = (workspaceId) => {

    const { auth } = useAuth();
    const { isPending, isSuccess, error, mutateAsync: joinWorkspaceMutation} = useMutation({
        mutationFn: (joinCode) => joinWorkspaceRequest({
            workspaceId,
            joinCode,
            token: auth?.token
        }),
        onSuccess: (response) => {
            console.log('User joined workspace successfully',response);
        },
        onError: (error) => {
            console.log('failed to join workspace',error);
        }
    });

    return {
        error,
        isPending,
        isSuccess,
        joinWorkspaceMutation
    };
};