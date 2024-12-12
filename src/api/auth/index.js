
import { axiosInstance } from '@/config/axiosConfig';

export const signUpRequest = async({email,password,username}) => {
    try {
        const response = await axiosInstance.post('/users/signup',{
            email: email,
            password: password,
            username: username
        });
        return response.data;
    } catch (error) {
        console.error('hii i am here at signUpRequest ',error);
        throw error.response.data;
    }
};

export const signInRequest = async ({email,password,loginType}) => {
    try{
        const response = await axiosInstance.post('/users/signin',{
            email: email,
            password: password,
            loginType: loginType
        });

        return response.data;
    }catch(error){
        console.error(error);
        throw error.response.data;
    }
};

export const verifyLoginRequest = async ({username, email}) => {
    try{
        const response = await axiosInstance.post('/users/validateuser',{
            email: email,
            username: username
        });

        return response.data;
    }catch(error){
        console.error(error);
        throw error.response.data;
    }
};


export const verifyOtpRequest = async({otp,email}) => {
    try {
        const response = await axiosInstance.post('/users/otpverification',{
            email:email,
            otp: otp
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response.data;
    }
};