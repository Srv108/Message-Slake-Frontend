import { useMutation } from '@tanstack/react-query';

import { updateProfilePicRequest } from '@/api/user';
import { useAuth } from '@/hooks/context/useAuth';

export const useUpdateProfilePic = () => {

    const { auth, setAuth } = useAuth();
    const { isPending, isSuccess, error, mutateAsync: updateProfilePicMutation } = useMutation({
        mutationFn: (formData) => updateProfilePicRequest({formData,token: auth?.token}),
        mutationKey: [`userDetails-${auth?.user?.id}`],
        onSuccess: (response) => {
            console.log(auth?.user);
            const updatedUserDetails = {
                ...auth?.user, 
                avatar: response.avatar};
            setAuth((prevAuth) => ({
                ...prevAuth,
                user: updatedUserDetails
            }));
            console.log(auth?.user);
            localStorage.setItem('user',JSON.stringify(updatedUserDetails));
        },
        onError: (error) => {
            console.log('Error coming in updating profile pic',error);
        }
    });

    return {
        error,
        isPending,
        isSuccess,
        updateProfilePicMutation
    };
};