import { useMutation } from '@tanstack/react-query';

import { deleteWorkspaceRequest } from '@/api/workspace';
import { useAuth } from '@/hooks/context/useAuth';

export const useDeleteWorkspace = (workspaceId) => {

    const { auth } = useAuth();

    const { isPending, error, isSuccess, mutateAsync: deleteWorkspaceMutation } = useMutation({
        mutationFn: async() => await deleteWorkspaceRequest({ workspaceId, token: auth?.token}),
        onSuccess: () => {
            console.log('Workspace Deleted Successfully');
            
        },
        onError: (error) => {
            console.log('Error in deleting workspace',error);
        }
    });

    return {
        error,
        isSuccess,
        isPending,
        deleteWorkspaceMutation
    };
};