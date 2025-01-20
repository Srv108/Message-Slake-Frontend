import { useMutation } from '@tanstack/react-query';

import { verifyOtpRequest } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';

export const useOtpVerification = () => {

    const { toast } = useToast();

    const {
        isLoading: otpLoadingState,
        error: otpErrorState, 
        isSuccess: otpSuccessState, 
        mutateAsync: otpMutation
    } = useMutation({
        mutationFn:async() => await verifyOtpRequest(),
        onSuccess: (response) => {
            console.log('Otp verified Successfully', response);
            toast({
                variant: 'success',
                title: 'Verified Successfully',
                description: 'In some time, you will be redirected to the password reset page',
            });
        },
        onError: (error) => {
            console.log('Otp verification failed',error);
            toast({
                variant: 'destructive',
                title: 'Failed to verify otp',
                description: 'Please try again!'
            });
        }
    });

    return {
        otpMutation,
        otpErrorState,
        otpLoadingState,
        otpSuccessState
    };
};