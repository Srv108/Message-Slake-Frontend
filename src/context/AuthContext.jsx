import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [auth, setAuth] = useState({
        user: null,
        token: null
    });

    useEffect( () => {

        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        console.log(auth);
        
        if(user && token){
            setAuth({
                user: JSON.parse(user),
                token,
            });
        }else{
            setAuth({
                user: null,
                token: null
            });
        }

    },[]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }} >
            {children}
        </AuthContext.Provider>
    );
};




export default AuthContext;