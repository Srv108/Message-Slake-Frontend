import { useQuery } from '@tanstack/react-query';

import { fetchAllRoomsRequest } from '@/api/room';
import { useAuth } from '@/hooks/context/useAuth';

export const useFtechAllRooms = () => {

    const { auth } = useAuth();
    const { isFetching, isPending, isSuccess, isError, error, data: AllRoomDetails} = useQuery({
        queryKey: [`ftechAllRooms-${auth?.user?.id}`],
        queryFn:async() => await fetchAllRoomsRequest(auth?.token),
    });

    return {
        error,
        isError,
        isPending,
        isFetching,
        isSuccess,
        AllRoomDetails
    };
};