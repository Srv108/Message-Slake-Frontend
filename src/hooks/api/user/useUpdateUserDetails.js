import { useMutation } from '@tanstack/react-query';

import { updateUsersDetailsRequest } from '@/api/user';
import { useAuth } from '@/hooks/context/useAuth';

export const useUpdateUserDetails = () => {

    const { auth } = useAuth();
    const { isPending, isSuccess, error, mutateAsync: updateUserMutation } = useMutation({
        mutationFn: async(payload) => await updateUsersDetailsRequest({...payload,token: auth?.token}),
        onSuccess: (response) => {
            console.log('Details updated successfully',response);
        },
        onError: (error) => {
            console.log('Error coming in update user hook',error);
        }
    });

    return {
        error,
        isPending,
        isSuccess,
        updateUserMutation
    };
};