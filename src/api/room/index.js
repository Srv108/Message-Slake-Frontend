import { axiosInstance } from '@/config/axiosConfig';

export const createRoomRequest = async({recieverId,token}) => {
    try {
        
        const response = await axiosInstance.post('/room',{recieverId},{
            headers: {
                'access-token': token
            }
        });

        console.log('response coming from creating room request',response);
        return response?.data?.data;
    } catch (error) {
        console.log('Error coming in creating room request',error);
        throw error.response.data;
    }
};

export const getAllRooms = async(token) => {
    try {
        
        const response = await axiosInstance.get('/room',{
            headers: {
                'access-token': token
            }
        });

        console.log('response coming from fetching all rooms request',response);
        return response?.data?.data;
    } catch (error) {
        console.log('Error coming in fetching all rooms request',error);
        throw error.response.data;
    }
};

export const fetchRoomOfAUser = async(recieverId,token) => {
    try {
        
        const response = await axiosInstance.get('/room/user',{recieverId},{
            headers: {
                'access-token': token
            }
        });

        console.log('response coming from fetching room of a user request',response);
        return response?.data?.data;
    } catch (error) {
        console.log('Error coming in fetching room by both user and owner request',error);
        throw error.response.data;
    }
};

export const updateRoomRequest = async(roomId,status,token) => {
    try {
        
        const response = await axiosInstance.put(`/room/${roomId}/update`,{status},{
            headers: {
                'access-token': token
            }
        });

        console.log('response coming from updating room request',response);
        return response?.data?.data;
    } catch (error) {
        console.log('Error coming in updating room request',error);
        throw error.response.data;
    }
};

export const deleteRoomRequest = async(roomId,token) => {
    try {

        const response = await axiosInstance.delete(`/room/${roomId}`,{
            headers: {
                'access-token': token
            }
        });
        
        console.log('response coming from updating room request',response);
        return response?.data?.data;
    } catch (error) {
        console.log('Error coming in deleting room request',error);
        throw error.response.data;
    }
};