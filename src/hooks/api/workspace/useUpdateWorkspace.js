import { useMutation } from '@tanstack/react-query';

import { updateWorkspaceRequest } from '@/api/workspace';
import { useAuth } from '@/hooks/context/useAuth';

export const useUpdateWorkspace = (workspaceId) => {
    
    const { auth } = useAuth();

    const { isPending, isSuccess, error, mutateAsync: updateWorkspaceMutataion} = useMutation({
        mutationFn: async(payload) => await updateWorkspaceRequest({
            name: payload.name,
            workspaceId: workspaceId,
            token: auth?.token
        }),
        onSuccess: (response) => {
            console.log('Workspace updated successfully',response);
        },
        onError: (error) => {
            console.log('Error in updating workspace hook ',error);
        }
    });

    return {
        error,
        isPending,
        isSuccess,
        updateWorkspaceMutataion
    };
};