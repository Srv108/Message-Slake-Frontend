import { useMutation } from '@tanstack/react-query';

import { deleteWorkspaceRequest } from '@/api/workspace';
import { useAuth } from '@/hooks/context/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useDeleteWorkspace = (workspaceId) => {

    const { auth } = useAuth();
    const { toast } = useToast();

    const { isPending, error, isSuccess, mutateAsync: deleteWorkspaceMutation } = useMutation({
        mutationFn: () => deleteWorkspaceRequest({ workspaceId, token: auth?.token}),
        onSuccess: () => {
            console.log('Workspace Deleted Successfully');
            toast ({
                variant: 'success',
                title: 'Workspace deleted successfully'
            });
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