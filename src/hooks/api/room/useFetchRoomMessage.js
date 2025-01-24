import { useQuery } from '@tanstack/react-query';

import { fetchRoomMessageRequest } from '@/api/room';
import { useAuth } from '@/hooks/context/useAuth';

export const useFetchRoomMessage = (roomId) => {

    const { auth } = useAuth();
    const { isFetching, isPending, isSuccess, isError, error, data: RoomMessageDetails } = useQuery({
        queryFn: async() => await fetchRoomMessageRequest({
            roomId,
            limit: 1000,
            offset: 1,
            token: auth?.token
        }),
        queryKey: ['fetchRoomMessages'],
        cacheTime: 0
    });

    return {
        error,
        isError,
        isSuccess,
        isPending,
        isFetching,
        RoomMessageDetails
    };
};