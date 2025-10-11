import { useMutation } from '@tanstack/react-query';

import { updateUsersDetailsRequest } from '@/api/user';
import { useAuth } from '@/hooks/context/useAuth';

export const useUpdateProfileDetails = () => {
    const { auth, setAuth } = useAuth();
    
    const { isPending, isSuccess, error, mutateAsync: updateProfileDetailsMutation } = useMutation({
        mutationFn: async(payload) => await updateUsersDetailsRequest({ payload, token: auth?.token }),
        mutationKey: [`userDetails-${auth?.user?.id}`],
        onSuccess: (response) => {
            // Update auth context with new user details
            const updatedUserDetails = {
                ...auth?.user,
                name: response.name,
                username: response.username,
                about: response.about,
                email: response.email
            };
            
            setAuth((prevAuth) => ({
                ...prevAuth,
                user: updatedUserDetails
            }));
            
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUserDetails));
        },
        onError: (error) => {
            console.log('Error updating profile details:', error);
        }
    });

    return {
        error,
        isPending,
        isSuccess,
        updateProfileDetailsMutation
    };
};
