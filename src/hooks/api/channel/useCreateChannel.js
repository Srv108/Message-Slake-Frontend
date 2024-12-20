import { useMutation } from '@tanstack/react-query';

import { createChannelRequest } from '@/api/channel';
import { useAuth } from '@/hooks/context/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useCreateChannel = () => {
    
    const { toast } = useToast();
    const { auth } = useAuth();

    const { isPending, isSuccess, error, mutateAsync: createChannelMutation} = useMutation({
        mutationFn: (data) => createChannelRequest({...data,token: auth?.token}),
        onError: (error) => {
            console.log('Error coming in Create channel hook',error);
            toast({
                variant: 'destructive',
                title: 'Failed to create channel !'
            });
        }
    });

    return {
        error,
        isSuccess,
        isPending,
        createChannelMutation
    };
};