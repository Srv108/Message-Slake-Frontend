import { axiosInstance } from '@/config/axiosConfig';

export const createRoomRequest = async({recieverId,username,token}) => {
    try {
        const reciever = ((recieverId) ? {recieverId: recieverId} : {username: username}) ;
        console.log('you are at create room with the user request',reciever);
        
        const response = await axiosInstance.post('/room',reciever,{
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

export const fetchAllRoomsRequest = async(token) => {
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

export const fetchRoomOfAUserRequest = async(recieverId,token) => {
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

export const getRoomByIdRequest = async({roomId,token}) => {
    try {
        
        const response = await axiosInstance.get(`/room/${roomId}`,{
            headers: {
                'access-token': token
            }
        });

        console.log('response coming from fetching room request',response);
        return response?.data?.data;
    } catch (error) {
        console.log('Error coming in getting room request',error);
        throw error.response.data;
    }
};

export const getRoomMessageRequest = async({roomId,token}) => {
    try {
        
        const response = await axiosInstance.get(`/directMessages/${roomId}`,{
            headers: {
                'access-token': token
            }
        });

        console.log('response coming from fetching room message request',response);
        return response?.data?.data;
    } catch (error) {
        console.log('Error coming in getting room message request',error);
        throw error.response.data;
    }
};