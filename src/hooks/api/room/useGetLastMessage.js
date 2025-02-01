import { useQuery } from '@tanstack/react-query';

import { fetchLastMessageDetailsRequest } from '@/api/room';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetLastMessageDetails = (roomId) => {

    const { auth } = useAuth();
    const { error, isError, isFetching, isSuccess, isLoading, data: lastMessageDetails} = useQuery({
        queryKey: [`fetch-last-message-${roomId}`],
        queryFn: () => fetchLastMessageDetailsRequest({
            roomId: roomId,
            token: auth?.token
        })
    });

    return {
        error,
        isError,
        isSuccess,
        isFetching,
        isLoading,
        lastMessageDetails
    };
};