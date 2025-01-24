import { useContext } from 'react';

import RoomMessageContext from '@/context/RoomMessage';

export const useRoomMessage = () => {
    return useContext(RoomMessageContext);
};