
import { axiosInstance } from '@/config/axiosConfig';

export const createChannelRequest = async (data) => {
    try {

        const response = await axiosInstance.put(`/workspace/${data.workspaceId}/channel`,{
            channelName: data.name
        },{
            headers: {
                'access-token' : data.token
            }
        });

        return response?.data?.data;
    } catch (error) {
        console.log('Error coming from create channel request',error);
        throw error.response.data;
    }
};