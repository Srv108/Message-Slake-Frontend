import { createContext, useState } from 'react';

const UserProfileContext = createContext();

export const UserProfileContextProvider = ({ children }) => {

    const [ openProfileModal, setOpenProfileModal ] = useState(false);

    return (
        <UserProfileContext.Provider value={{ openProfileModal, setOpenProfileModal }} >
            { children }
        </UserProfileContext.Provider>
    );
};
export default UserProfileContext;