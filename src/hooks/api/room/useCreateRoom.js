import { useMutation } from '@tanstack/react-query';

import { createRoomRequest } from '@/api/room';
import { useAuth } from '@/hooks/context/useAuth';

export const useCreateRoom = (recieverId) => {

    const { auth } = useAuth();

    const { isPending, isError, isSuccess, error, mutateAsync: createRoomMutation} = useMutation({
        mutationFn: () => {createRoomRequest({
            recieverId: recieverId,
            token: auth?.token
        });},
        onError: (error) => {
            console.log('Error coming in create room hooks',error);
        },
        onSuccess: (response) => {
            console.log('room created successfully');
            console.log('response coming in create room hooks',response);
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