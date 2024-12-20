import { useMutation } from '@tanstack/react-query';

import { addMembersToWorkspaceRequest } from '@/api/workspace';
import { useAuth } from '@/hooks/context/useAuth';
import { useWorkspace } from '@/hooks/context/useWorkspace';
import { useToast } from '@/hooks/use-toast';

export const useAddMemberToWorkspace = () => {
    
    const { auth } = useAuth();
    const { toast } = useToast();
    const { currentWorkspace } = useWorkspace();
    const { isPending, isSuccess, error, mutateAsync: addMemberToWorkspaceMutation} = useMutation({
        mutationFn: (data) => addMembersToWorkspaceRequest({
            ...data,
            token: auth?.token,
            workspaceId: currentWorkspace?._id
        }),
        mutationKey: (data) => [`FetchMembers-${data.userId}`],
        onSuccess: (response) => {
            console.log('Member Added successfully',response);
            toast({
                variant: 'success',
                title: 'Member added Successfully',
            });
        },
        onError: () => {
            toast({
                variant: 'destructive',
                title: 'Failed to add member',
            });
        }
    });

    return {
        error,
        isSuccess,
        isPending,
        addMemberToWorkspaceMutation
    };
};