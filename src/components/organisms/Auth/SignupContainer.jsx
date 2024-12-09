import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSignup } from '@/hooks/api/auth/useSignup';

import { SignupCard } from './SignupCard';

export const SignupContainer = () => {


    const navigate = useNavigate();
    const [signupForm, setSignupForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [validationError,setValidationError] = useState(null);

    const { isPending, isSuccess, error, signupMutation } = useSignup();

    async function onSignupFormSubmit(e){
        e.preventDefault();
        
        console.log('Form submitted successfully', signupForm);

        if(!signupForm.email || !signupForm.username || !signupForm.password || !signupForm.confirmPassword){
            console.log('All Fields are required');
            setValidationError({message :'All fields are required!'});
            
            return;
        }

        if(signupForm.password !== signupForm.confirmPassword) {
            console.error('Passwords do not match');
            setValidationError({ message: 'Passwords do not match' });
            return;
        }

        setValidationError(null);

        await signupMutation({
            username: signupForm.username,
            email: signupForm.email,
            password: signupForm.password
        });

    }

    useEffect(() => {
        if(isSuccess){
            setTimeout(() => {
                navigate('/auth/signin');
            },3000);
        } 
    },[ isSuccess , navigate]);

    return (
        <>
            <SignupCard 
                error={error}
                isPending={isPending}
                isSuccess={isSuccess}
                signupForm={signupForm}
                setSignupForm={setSignupForm}
                validationError={validationError}
                onSignupFormSubmit={onSignupFormSubmit}
            />
        </>
    );
};