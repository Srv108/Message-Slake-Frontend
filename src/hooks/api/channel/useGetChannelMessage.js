import { useQuery } from '@tanstack/react-query';

import { getPaginatedMessageRequest } from '@/api/channel';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetChannelMessage = (channelId) => {

    const { auth } = useAuth();
    const { isFetching, isError, isSuccess, error, data: channelMessages} = useQuery({
        queryFn: () => getPaginatedMessageRequest({
            channelId,
            limit: 40,
            offset: 1,
            token: auth?.token
        }),
        queryKey: ['getChannelMessages']
    });

    return {
        error,
        isFetching,
        isError,
        isSuccess,
        channelMessages
    };
};