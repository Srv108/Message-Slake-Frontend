import { axiosInstance } from '@/config/axiosConfig';

export const createWorkspaceRequest = async(workspaceDetails) => {
    try {
        const response = await axiosInstance.post('/workspace',{
            name: workspaceDetails.name,
            description: workspaceDetails.description
        },{
            headers: {
                'access-token' : workspaceDetails.token
            }
        });

        return response.data;
    } catch (error) {
        console.log('error coming from create workspace request',error);
        throw error.response.data;
    }
};

export const getWorkspaceRequest = async(id) => {
    try{
        const response = await axiosInstance.get(`/workspace/${id}`);

        return response.data;
    }catch(error){
        console.log('error coming from get workspace request',error);
        throw error.response.data;
    }
};