import { useContext } from 'react';

import SocketContext from '@/context/SocketContex';

export const useSocket = () => {
    return useContext(SocketContext);
};