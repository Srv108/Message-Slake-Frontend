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

export const getWorkspaceRequest = async({workspaceId, token}) => {
    try{
        const response = await axiosInstance.get(`/workspace/${workspaceId}`,{
            headers: {
                'access-token' : token
            }
        });

        return response.data.data;
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
        return response.data.data.data;
    } catch (error) {
        console.log('Error in fetching all workspace of member',error);
        throw error.response.data;
    }
};

export const deleteWorkspaceRequest = async ({ workspaceId, token}) => {
    try {
        const response = await axiosInstance.delete(`/workspace/${workspaceId}`,{
            headers: {
                'access-token' : token
            }
        });

        return response.data;
    } catch (error) {
        console.log('Error coming in deleting workspace request ',error);
        throw error.response.data;
    }
};

export const updateWorkspaceRequest = async({ workspaceId, payload, token}) => {
    try {
        const response = await axiosInstance.put(`/workspace/${workspaceId}/update`,{ payload },{
            headers: {
                'access-token' : token
            }
        });
    
        return response.data;
        
    } catch (error) {
        console.log('Error coming in updating workspace request ',error);
        throw error.response.data;
    }
};