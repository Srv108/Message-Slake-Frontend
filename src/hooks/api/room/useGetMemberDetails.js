import { useQuery } from '@tanstack/react-query';

import { fetchMemberDetailsRequest } from '@/api/room';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetMemberDetails = (memberId) => {

    const { auth } = useAuth();
    const { isFetching, 
        isLoading, 
        isError, 
        error, 
        isPending, 
        isSuccess, 
        data: RoomMember
    } = useQuery({
        queryKey: [`Fetch-Member-Details-${memberId}`],
        queryFn: () => fetchMemberDetailsRequest({
            memberId: memberId,
            token: auth?.token
        })
    });
    return {
        error,
        isError,
        isPending,
        isFetching,
        isLoading,
        isSuccess,
        RoomMember
    };
};