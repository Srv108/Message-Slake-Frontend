import { useState } from 'react';


export const useConfirm = () => {

    const [promise,setPromise] = useState(null);

    async function confirmation() {
        console.log('confirmation fun hits');
        return new Promise((resolve) => {
            setPromise({resolve});
        });
    }

    const  handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    return {promise, handleClose, handleConfirm, confirmation};
};