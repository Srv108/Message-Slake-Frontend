import {  useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useOtpVerification } from '@/hooks/api/auth/useOtpVerification';
import { useVerifyLogin } from '@/hooks/api/auth/useVerifyLogin';

import { ForgetAccountCard } from './ForgetAccountCard';

export const ForgetAccountContainer = () => {


    const navigate = useNavigate();

    /* for verify login credentials  */
    const [verifyForm, setVerifyForm] = useState({
        username: '',
        email: ''
    });


    /* to verify otp credentials  */
    const [otpForm, setOtpForm] = useState({
        otp: '',
        email: ''
    });

    const [validationError, setValidationError] = useState(null);

    /* for verify login credentials  */
    const {isPending, isSuccess, error, verifyloginMutation} = useVerifyLogin();

    async function onVerifyFormSubmit(e){
        e.preventDefault();
        console.log(verifyForm);

        if(!verifyForm.username || !verifyForm.email){
            console.log('All fields are requires');
            setValidationError({message :'All fields are required!'});

            return;
        }
        setOtpForm({...otpForm,email: verifyForm.email});
        setValidationError(null);

        await verifyloginMutation({
            email: verifyForm.email,
            username: verifyForm.username
        });

    }


    /* For Otp verification  */
    const {otpLoadingState, otpSuccessState, otpErrorState, otpMutation} = useOtpVerification();
    
    async function otpSubmit(e){
        e.preventDefault();
        console.log('submitted otp is ',otpForm);

        await otpMutation({
            email: verifyForm.email,
            otp: otpForm.otp
        });
    };


    useEffect(() => {
        if(otpSuccessState){
            setTimeout(() => {
                navigate('/home');
            },3000);
        }
    },[otpSuccessState, navigate]);

    return (
        <ForgetAccountCard
            error={error}
            otpForm={otpForm}
            setOtpForm={setOtpForm}
            otpSubmit={otpSubmit}
            isPending={isPending}
            isSuccess={isSuccess}
            verifyForm={verifyForm}
            otpErrorState={otpErrorState}
            setVerifyForm={setVerifyForm}
            otpSuccessState={otpSuccessState}
            validationError={validationError}
            otpLoadingState={otpLoadingState}
            onVerifyFormSubmit={onVerifyFormSubmit}
        />
    );
};