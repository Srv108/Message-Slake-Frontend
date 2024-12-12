import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSignin } from '@/hooks/api/auth/useSignin';

import { SigninCard } from './SigninCard';

export const SigninContainer = () => {

    const navigate = useNavigate();
    const [signinForm, setSigninForm] = useState({
        email: '',
        password: '',
        loginType: 'email'
    });
    const [validationError, setValidationError] = useState(null);

    const { isPending,isSuccess,error,signinMutation } = useSignin();


    async function onSigninFormSubmit(e) {
        e.preventDefault();
        console.log('Form Submitted Successfully ', signinForm);
        
        if(!signinForm.email || !signinForm.password){
            console.log('All Fields are required');
            setValidationError({message :'All fields are required!'});
            
            return;
        }

        setValidationError(null);

        await signinMutation({
            email: signinForm.email,
            password: signinForm.password,
            loginType: signinForm.loginType
        });
    }

    useEffect(() => {
        if(isSuccess){
            setTimeout(() => {
                navigate('/home');
            },3000);
        }
    },[isSuccess, navigate]);

    return(
        <SigninCard 
            error={error}
            isSuccess={isSuccess}
            isPending={isPending}
            signinForm={signinForm}
            setSigninForm={setSigninForm}
            validationError={validationError}
            onSigninFormSubmit={onSigninFormSubmit}
        />
    );
};