import { useQuery } from '@tanstack/react-query';

import { getWorkspaceRequest } from '@/api/workspace';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetWorkspaceById = (id) => {

    const { auth } = useAuth();
    
    const { isFetching, isSuccess, isLoading, error, data: workspaceData, isError } = useQuery({
        queryKey: [`fetchWorkspace-${id}`],
        queryFn: () => getWorkspaceRequest({workspaceId: id,token: auth?.token}),
        staleTime: 30000
    });

    return {
        error,
        isError,
        isSuccess,
        isFetching,
        isLoading,
        workspaceData
    };
};