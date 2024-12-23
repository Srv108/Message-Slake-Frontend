import { axiosInstance } from '@/config/axiosConfig';

export const updateProfilePicRequest = async({formData, token}) => {
    try {
        const response = await axiosInstance.put('/users/update/dp',formData,{
            headers: {
                'access-token': token
            }
        });
        return response?.data?.data;
    } catch (error) {
        console.log('Error coming from updating profile ',error);
        throw error.response.data;
    }
};

export const updateUsersDetailsRequest = async({payload, token}) => {
    try {
        const response = await axiosInstance.put('/users/update/profile',{
            payload
        },{
            headers: {
                'access-token': token
            }
        });

        return response?.data?.data;
    } catch (error) {
        console.log('Error coming in update users details request',error);
        throw error.response.data;
    }
};

export const updatePasswordRequest = async({password,token}) => {
    try{
        const response = await axiosInstance.put('/users/updatepassword',{
            password: password
        },{
            headers: {
                'access-token': token
            }
        });

        return response?.data?.data;
    }catch(error){
        console.log('Error coming in updating password request',error);
        throw error.response.data;
    }
};