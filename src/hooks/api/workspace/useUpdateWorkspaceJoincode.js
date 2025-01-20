import { useMutation } from '@tanstack/react-query';

import { updateWorkspaceJoinCodeRequest } from '@/api/workspace';
import { useAuth } from '@/hooks/context/useAuth';

export const useUpdateWorkspaceJoincode = (workspaceId) => {

    const { auth } = useAuth();

    const { isPending, isSuccess, error, mutateAsync: updateWorkspaceJoinCodeMutation } = useMutation({
        mutationFn: async() => await updateWorkspaceJoinCodeRequest({ workspaceId: workspaceId,token: auth?.token}),
        onSuccess: (response) => {
            console.log('Join code updated successfully',response);

        },
        onError: (error) => {
            console.log('failed to update joincode',error);
        }
    });

    return {
        error,
        isPending,
        isSuccess,
        updateWorkspaceJoinCodeMutation
    };
};