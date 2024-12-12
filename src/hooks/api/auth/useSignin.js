import { useMutation } from '@tanstack/react-query';

import { signInRequest } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';


export const useSignin = () => {

    const { toast } = useToast();
    const {isPending, isSuccess, error, mutateAsync: signinMutation } = useMutation({
        mutationFn: signInRequest,
        onSuccess: (response) => {
            console.log('Scuccessfuilly signed up', response);

            const user = JSON.stringify(response.data);
            const token = response.data.token;
            localStorage.setItem('user',user);
            localStorage.setItem('token',token);

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
        signinMutation
    };
};