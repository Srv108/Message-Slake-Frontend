import { useQuery } from '@tanstack/react-query';

import { getRoomByIdRequest } from '@/api/room';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetRoomById = (roomId) => {

    const { auth } = useAuth();
    const { isLoading, isError, error, isSuccess, isFetching, data: roomDetails} = useQuery({
        queryFn: async() => {await getRoomByIdRequest({
            roomId,
            token: auth?.token
        });},
        queryKey: [`fetchrooms-${roomId}`]
    });

    return {
        error,
        isError,
        isFetching,
        isLoading,
        isSuccess,
        roomDetails
    };
};