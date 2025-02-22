import { EllipsisVerticalIcon, PhoneIcon, VideoIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetMemberDetails } from '@/hooks/api/room/useGetMemberDetails';
import { useGetUserMedia } from '@/hooks/context/useGetUserMedia';

export const RoomHeader = ({ userID, roomId }) => {

    const navigate = useNavigate();
    const { isSuccess, RoomMember } = useGetMemberDetails(userID);
    const { setCallDialed } = useGetUserMedia();
    useEffect(() => {
        if(isSuccess){
            console.log('room member details is ',RoomMember);
        }
    },[isSuccess,RoomMember]);

    return (
        <div
            className="border-b h-[50px] flex items-center justify-between px-4 overflow-hidden bg-slack-medium"
        >
            <div className="text-teal-300 font-extrabold font-serif">
                { RoomMember?.username }
            </div>
            <div className="flex space-x-1 items-center justify-center">
                <div className='flex justify-center items-center p-2'>
                    <button className="flex justify-center items-center space-x-1 p-2 ">
                        <PhoneIcon className="size-4 text-teal-300  hover:text-teal-600 transition-all" />
                    </button>
                    <button 
                        onClick={() => navigate(`/directMessages/chat/${roomId}/video/call`)}
                        className="flex justify-center items-center p-2"
                    >
                        <VideoIcon onClick={() => setCallDialed(true)} className="size-6 text-teal-400  hover:text-teal-600 transition-all" />
                    </button>
                </div>
                <button className="flex justify-center items-center pt-1 pb-1">
                    <EllipsisVerticalIcon className="size-5 text-teal-400  hover:text-teal-600 transition-all" />
                </button>
            </div>
        </div>
    );
};