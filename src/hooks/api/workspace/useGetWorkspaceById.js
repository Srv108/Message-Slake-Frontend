import { useQuery } from '@tanstack/react-query';

import { getWorkspaceRequest } from '@/api/workspace';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetWorkspaceById = (id) => {

    const { auth } = useAuth();
    
    const { isFetching, isSuccess, isLoading, error, data: workspaceDetails, isError } = useQuery({
        queryKey: [`fetchWorkspace-${id}`],
        queryFn: async() => await getWorkspaceRequest({workspaceId: id,token: auth?.token}),
        staleTime: 30000
    });

    return {
        error,
        isError,
        isSuccess,
        isFetching,
        isLoading,
        workspaceDetails
    };
};