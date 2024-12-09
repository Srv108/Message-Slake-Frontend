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
        console.log(error);
        throw error.response.data;
    }
};

export const signInRequest = async ({email,password}) => {
    try{
        const response = await axiosInstance.get('/users/signin',{
            email,
            password
        });

        return response.data;
    }catch(error){
        console.log(error);
        throw error.response.data;
    }
};