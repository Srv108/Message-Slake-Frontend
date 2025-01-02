import { useQuery } from '@tanstack/react-query';

import { getChannelByIdRequest } from '@/api/channel';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetChannelById = (channelId) => {

    const { auth } = useAuth();
    const { isFetching, isError, isLoading, isSuccess, error, data: channelsDetails} = useQuery({
        queryKey: [`fetchChannel-${channelId}`],
        queryFn: () => getChannelByIdRequest({
            channelId,
            token: auth?.token
        }),
    });
    return {
        error,
        isError,
        isSuccess,
        isLoading,
        isFetching,
        channelsDetails
    };
};