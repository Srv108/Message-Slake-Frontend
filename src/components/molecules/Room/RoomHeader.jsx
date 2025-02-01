import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useGetMemberDetails } from '@/hooks/api/room/useGetMemberDetails';

export const RoomHeader = ({ userID }) => {

    const { isSuccess, RoomMember } = useGetMemberDetails(userID);

    useEffect(() => {
        if(isSuccess){
            console.log('room member details is ',RoomMember);
        }
    },[isSuccess,RoomMember]);

    return (
        <div
            className="border-b h-[50px] flex items-center justify-between px-4 overflow-hidden bg-slack-medium"
        >
            <div className="text-white">
                { RoomMember?.username }
            </div>
            <div className='space-x-2'>
                <Button
                    variant='transparent'
                >
                    {'call'}
                </Button>
                <Button
                    variant='transparent'
                >
                    {'video'}
                </Button>
            </div>
        </div>
    );
};