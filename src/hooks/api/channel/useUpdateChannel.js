import { useMutation } from '@tanstack/react-query';

import { updateChannelRequest } from '@/api/channel';
import { useAuth } from '@/hooks/context/useAuth';

export const useUpdateChannel = (channelId) => {
    const { auth } = useAuth();

    const { isPending, isSuccess, error, mutateAsync: updateChannelMutation } = useMutation({
        mutationFn: async (payload) => await updateChannelRequest({
            channelId: channelId,
            name: payload.name,
            token: auth?.token
        }),
        onSuccess: (response) => {
            console.log('Channel updated successfully', response);
        },
        onError: (error) => {
            console.log('Error in updating channel hook', error);
        }
    });

    return {
        error,
        isPending,
        isSuccess,
        updateChannelMutation
    };
};
