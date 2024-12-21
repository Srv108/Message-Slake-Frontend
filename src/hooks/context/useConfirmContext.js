import { useContext } from 'react';

import ConfirmModalContext from '@/context/ConfirmModalContext';

export const useConfirmContext = () => {
    return useContext(ConfirmModalContext);
};