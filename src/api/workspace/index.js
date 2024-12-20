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

        return response?.data?.data;
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

        return response?.data?.data;
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

        return response?.data?.data?.data;
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

        return response?.data.data;
    } catch (error) {
        console.log('Error coming in deleting workspace request ',error);
        throw error.response.data;
    }
};

export const updateWorkspaceRequest = async({ workspaceId, name, token}) => {
    try {
        console.log(name);
        const response = await axiosInstance.put(`/workspace/${workspaceId}/update`,{name},{
            headers: {
                'access-token' : token
            }
        });
    
        return response?.data?.data;
        
    } catch (error) {
        console.log('Error coming in updating workspace request ',error);
        throw error.response.data;
    }
};

export const addMembersToWorkspaceRequest = async ({ workspaceId, userId, role, token}) => {
    try {
        console.log(workspaceId,userId,role,token);
        const response = await axiosInstance.put(`/workspace/${workspaceId}/members`,{
            user: userId,
            role: role
        },{
            headers: {
                'access-token' : token
            }
        });

        return response?.data?.data;
    } catch (error) {
        console.log('Error coming in adding members to the workspace',error);
        throw error.response.data;
    }
};