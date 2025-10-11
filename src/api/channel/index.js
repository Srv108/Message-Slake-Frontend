
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

export const getChannelByIdRequest = async({ channelId, token}) => {
    try {
        const response = await axiosInstance.get(`/channel/${channelId}`,{
            headers: {
                'access-token': token
            }
        });

        return response?.data?.data?.data;
    } catch (error) {
        console.log('Error coming from requesting channel id',error);
        throw error.response.data;
    }
};

export const getPaginatedMessageRequest = async ({ channelId, limit, offset, token }) => {
    try {
        const response = await axiosInstance.get(`/messages/${channelId}`,{
            params: {
                limit: limit || 20,
                page: offset || 1
            },
            headers: {
                'access-token': token
            }
        });

        return response?.data?.data?.data;
    } catch (error) {
        console.log('Error coming in getting paginated message request',error);
        throw error.response.data;
    }
};

export const updateChannelRequest = async ({ channelId, name, token }) => {
    try {
        const response = await axiosInstance.patch(`/channel/${channelId}`, {
            channelName: name
        }, {
            headers: {
                'access-token': token
            }
        });

        return response?.data?.data;
    } catch (error) {
        console.log('Error coming from update channel request', error);
        throw error.response.data;
    }
};