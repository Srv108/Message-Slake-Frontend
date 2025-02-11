import { useMutation } from '@tanstack/react-query';

import { deleteMessageRequest } from '@/api/room';
import { useAuth } from '@/hooks/context/useAuth';

export const useDeleteMessage = () => {
    
    const { auth } = useAuth();
    const { isSuccess, isPending, isError, error, mutateAsync: deleteMessageMutation} = useMutation({
        mutationFn: (data) => deleteMessageRequest({
            ...data,
            token: auth?.token
        }),
        onError: () => {
            console.log('Message deletion failed');
        },
        onSuccess: () => {
            console.log('Message deleted successfully');
        }
    });

    return {
        error,
        isError,
        isSuccess,
        isPending,
        deleteMessageMutation
    };
};