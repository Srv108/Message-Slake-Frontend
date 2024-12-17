import { useMutation } from '@tanstack/react-query';

import { createWorkspaceRequest } from '@/api/workspace';
import { useAuth } from '@/hooks/context/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useCreateWorkspce = () => {

    const { auth } = useAuth();
    const { toast } = useToast();
    const { isPending, isSuccess, error, mutateAsync: createWorkspaceMutation  } = useMutation({
        mutationFn: (data) => createWorkspaceRequest({...data, token: auth?.token}),
        onSuccess: (response) => {
            console.log(response);
            toast({
                variant: 'success',
                title: `${response.name} created Successfully`,
            });
        },
        onError: (error) => {
            console.log('error coming in create Workspace mutation ',error);
            toast({
                variant: 'destructive',
                title: 'Failed to create workspace',
            });
        }
    });

    return {
        isPending,
        isSuccess,
        error,
        createWorkspaceMutation
    };
};