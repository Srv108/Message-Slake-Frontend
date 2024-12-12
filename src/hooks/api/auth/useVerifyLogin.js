import { useMutation } from '@tanstack/react-query';

import { verifyLoginRequest } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';

export const useVerifyLogin = () => {

    const { toast } = useToast();

    const { isSuccess, isPending, error, mutateAsync: verifyloginMutation} =  useMutation({
        mutationFn: verifyLoginRequest,
        onSuccess: (response) => {
            console.log('verified',response);
            toast({
                variant: 'success',
                tittle: 'Otp verificetion',
                description: `Otp sent to your email ${response.data.email}`
            });

        },
        onError: (error) => {
            console.log('Failed to sign up', error);
            toast({
                variant: 'destructive',
                title: 'Failed to verify your request',
                description: 'Please try again...'
            });
        },
    });


    return {
        isPending,
        isSuccess,
        error,
        verifyloginMutation
    };
};