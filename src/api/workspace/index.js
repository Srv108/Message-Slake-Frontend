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

        return response.data.data;
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

export const fetchAllWorkspaceOfMemberRequest = async(token) => {
    try {
        const response = await axiosInstance.get('/workspace',{
            headers: {
                'access-token' : token
            }
        });

        console.log('Workspace fetched ', response.data);
        return response.data;
    } catch (error) {
        console.log('Error in fetching all workspace of member',error);
        throw error.response.data;
    }
};