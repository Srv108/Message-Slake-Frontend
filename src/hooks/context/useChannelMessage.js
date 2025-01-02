import { useContext } from 'react';

import ChannelMessage from '@/context/ChannelMessage';

export const useChannelMessage = () => {
    return useContext(ChannelMessage);
};