import { useQuery } from '@tanstack/react-query';

import { fetchAllWorkspaceOfMemberRequest } from '@/api/workspace';
import { useAuth } from '@/hooks/context/useAuth';

export const useFetchWorkspaceOfMember = () => {

    const { auth } = useAuth();

    const { isFetching, isSuccess, error, data: Workspaces} = useQuery({
        queryFn: async() => await fetchAllWorkspaceOfMemberRequest(auth?.token),
        queryKey: ['fetchworkspaces'],
        staleTime: 30000,
    });

    return{
        error,
        isSuccess,
        isFetching,
        Workspaces
    };
};