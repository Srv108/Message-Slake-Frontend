import { useMutation } from '@tanstack/react-query';

import { signUpRequest } from '@/api/auth';

export const useSignup = () => {
    const {isPending, isSuccess, error, mutateAsync: signupMutation } = useMutation({
        mutationFn: signUpRequest,
        onSuccess: (data) => {
            console.log('Scuccessfuilly signed up', data);
        },
        onError: (error) => {
            console.log('Failed to sign up', error);
        },
    });

    return {
        isPending,
        isSuccess,
        error,
        signupMutation
    };
};