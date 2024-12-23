import { createContext, useState } from 'react';

const AcceptFileContex = createContext();

export const AcceptFileContexProvider = ({ children }) => {

    const [openAcceptFileModal, setOpenAcceptFileModal ] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    return (
        <AcceptFileContex.Provider value={{ 
            file, 
            setFile,
            preview,
            setPreview,
            openAcceptFileModal,
            setOpenAcceptFileModal
        }} >
            { children }
        </AcceptFileContex.Provider>
    );
};
export default AcceptFileContex;