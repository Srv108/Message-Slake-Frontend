import { axiosInstance } from '@/config/axiosConfig';

export const createRoomRequest = async({recieverId,username,token}) => {
    try {
        const reciever = ((recieverId) ? {recieverId: recieverId} : {username: username}) ;
        
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

export const fetchMemberDetailsRequest = async({ memberId,token }) => {
    try {
        const response = await axiosInstance.get('/room/member',{
            headers: {
                'access-token': token
            },
            params: { memberId }
        });

        return response?.data?.data?.data;
    } catch (error) {
        console.log('Error coming in fetching member request',error);
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

        console.log('response coming from getting room details',response?.data?.data);
        return response?.data?.data;
    } catch (error) {
        console.log('Error coming in getting room request',error);
        throw error.response.data;
    }
};

export const fetchRoomMessageRequest = async({roomId,limit,offset,token}) => {
    try {
        
        const response = await axiosInstance.get(`/directMessages/${roomId}`,{
            params: {
                limit: limit || 20,
                page: offset || 1
            },
            headers: {
                'access-token': token
            }
        });

        console.log('response coming from fetching room message request',response);
        return response?.data?.data?.data;
    } catch (error) {
        console.log('Error coming in getting room message request',error);
        throw error.response.data;
    }
};

export const fetchLastMessageDetailsRequest = async({ roomId, token,}) => {
    try {
        console.log('calling lst message api');
        const response = await axiosInstance.get(`/directMessages/${roomId}/lastMessage`,{
            headers: {
                'access-token': token
            }
        });
        console.log('response coming from fetching last message ',response);
        return response?.data?.data;
    } catch (error) {
        console.log('Error coming in fetching last message Details',error);
    }
};

export const deleteMessageRequest = async({ messageId, token }) => {
    try {
        
        const response = await axiosInstance.delete(`/directMessages/delete/${messageId}`,{
            headers: {
                'access-token': token
            }
        });

        return response?.data?.data;
    } catch (error) {
        console.log('error coming in deleting message request',error);
        throw error?.response;
    }
};