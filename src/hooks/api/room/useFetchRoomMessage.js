import { useQuery } from '@tanstack/react-query';

import { fetchRoomMessageRequest } from '@/api/room';
import { useAuth } from '@/hooks/context/useAuth';

export const useFetchRoomMessage = (roomId) => {

    const { auth } = useAuth();
    const { isFetching, isPending, isSuccess, isError, error, data } = useQuery({
        queryFn: async() => await fetchRoomMessageRequest({
            roomId,
            limit: 1000,
            offset: 1,
            token: auth?.token
        }),
        queryKey: ['fetchRoomMessages', roomId],
        enabled: !!roomId && !!auth?.token,
        cacheTime: 0,
        staleTime: 0,
    });

    console.log('🔍 useFetchRoomMessage Debug:');
    // console.log('  - roomId:', roomId);
    // console.log('  - isSuccess:', isSuccess);
    // console.log('  - data:', data);
    // console.log('  - data type:', typeof data);
    // console.log('  - data is array:', Array.isArray(data));

    return {
        error,
        isError,
        isSuccess,
        isPending,
        isFetching,
        RoomMessageDetails: data
    };
};