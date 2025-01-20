import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createRoomRequest } from '@/api/room';
import { useAuth } from '@/hooks/context/useAuth';

export const useCreateRoom = () => {

    const { auth } = useAuth();
    const queryClient = useQueryClient();

    const { isPending, isError, isSuccess, error, mutateAsync: createRoomMutation} = useMutation({
        mutationFn: async(data) => await createRoomRequest({
            recieverId: data?.recieverId,
            username: data?.username,
            token: auth?.token
        }),
        onError: (error) => {
            console.log('Error coming in create room hooks',error);
        },
        onSuccess: (response) => {
            console.log('Room created successfully:', response);

            queryClient.invalidateQueries([`ftechAllRooms-${auth?.user?.id}`]);
        }
    });

    return {
        error,
        isError,
        isPending,
        isSuccess,
        createRoomMutation
    };
};