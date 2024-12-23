import { useContext } from 'react';

import UserProfileContext from '@/context/UserProfileContext';

export const useProfileModal = () => {
    return useContext(UserProfileContext);
};