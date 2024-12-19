import { useContext } from 'react';

import CreateChannelContext from '@/context/CreateChannelContext';

export const useCreateChannelContext = () => {
    return useContext(CreateChannelContext);
};