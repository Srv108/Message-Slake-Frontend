import axios from 'axios';

import { axiosInstance } from '@/config/axiosConfig';

export const uploadImageToAwsPresignedUrl = async({ url , file}) => {
    try {

        const response = await axios.put(url, file, {
            headers: {
                'Content-Type': file.type
            }
        });

        console.log('response coming from s3 request',response);
        return response?.data?.data;
    } catch (error) {
        console.log('Error coming in uploading file to aws presigned url',error);
        throw error.response.data;
    }
};
export const getPresignedUrlRequest = async({token,fileName,contentType}) => {
    try {
        
        const response = await axiosInstance.get('/messages/pre-signed-url',{
            headers: {
                'access-token': token
            },
            params:{
                fileName,
                contentType
            }
        });

        return response?.data?.data?.data;
    } catch (error) {
        console.log('Error coming from getting presigned url ',error);
        throw error.response.data;
    }
};