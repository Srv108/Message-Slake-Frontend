import { useMutation } from '@tanstack/react-query';

import { updateRoomRequest } from '@/api/room';
import { useAuth } from '@/hooks/context/useAuth';

export const useRoomUpdate = () => {

    const { auth } = useAuth();
    const { isPending, error, isSuccess, mutateAsync: roomUpdateMutation} = useMutation({
        mutationFn: (data) => {updateRoomRequest({
            ...data,
            token: auth?.token
        });},
        onError: (error) => {
            console.log('failed to update room status',error);
        },
        onSuccess: (response) => {
            console.log('room updated successfully',response);
        }
    });

    return {
        error,
        isPending,
        isSuccess,
        roomUpdateMutation
    };
};