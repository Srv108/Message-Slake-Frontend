import { useContext } from 'react';

import RoomDetailsContext from '@/context/RoomDetailsContext';

export const useRoomDetails = () => {
    return useContext(RoomDetailsContext);
};