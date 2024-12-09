import { useMutation } from '@tanstack/react-query';

import { signInRequest } from '@/api/auth';


export const useSignin = () => {
    const {isPending, isSuccess, error, mutateAsync: signinMutation } = useMutation({
        mutationFn: signInRequest,
        onSuccess: (data) => {
            console.log('Successfuilly signed in', data);
        },
        onError: (error) => {
            console.log('Failed to sign in', error);
        },
    });

    return {
        isPending,
        isSuccess,
        error,
        signinMutation
    };
};