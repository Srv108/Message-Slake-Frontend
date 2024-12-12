import { useMutation } from '@tanstack/react-query';

import { signUpRequest } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';

export const useSignup = () => {

    const { toast } = useToast();
    const {isPending, isSuccess, error, mutateAsync: signupMutation } = useMutation({
        mutationFn: signUpRequest,
        onSuccess: (data) => {
            console.log('Scuccessfuilly signed up', data);
            toast({
                variant: 'success',
                title: 'Signup Successfully',
                description: 'In some time, you will be redirected to the sign-in page',
            });
        },
        onError: (error) => {
            console.log('Failed to sign up', error);
            toast({
                variant: 'destructive',
                title: 'Failed to sign up',
                description: 'Please try again...'
            });
        },
    });

    return {
        isPending,
        isSuccess,
        error,
        signupMutation
    };
};