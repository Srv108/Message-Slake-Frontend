import { useContext } from 'react';

import UserMediaContext from '@/context/mediaAccessContext';

export const useGetUserMedia = () => {
    return useContext(UserMediaContext);
};