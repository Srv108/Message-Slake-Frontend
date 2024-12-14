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
                title: `${response.data.name} created Successfully`,
                description: 'In some time, you will be redirected to the sign-in page',
            });
        },
        onError: (error) => {
            console.log('error coming in create Workspace mutation ',error);
            toast({
                variant: 'destructive',
                title: 'Failed to create workspace',
                description: 'Please try again...'
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