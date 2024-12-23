import { useContext } from 'react';

import AcceptFileContex from '@/context/AcceptFileContext';

export const useAcceptFile = () => {
    return useContext(AcceptFileContex);
};