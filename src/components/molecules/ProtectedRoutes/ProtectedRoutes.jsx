import { Navigate } from 'react-router-dom';

import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/context/useAuth';

export const ProtectedRoutes = ({children}) => {

    const { auth } = useAuth();

    if(auth.isLoading){
        return (
            <>
                <div className='w-full h-screen flex justify-center items-center'>
                    <div className='w-1/2'>
                        <Progress value={48} />
                    </div>
                </div>
            </>
        );
    }

    if(!auth.user || !auth.token){
        return <Navigate to='/auth/signin' />;
    }

    /* also check for the localstorage to validate the token */
    
    return children;
};