import { Loader2Icon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFetchWorkspaceOfMember } from '@/hooks/api/workspace/useFetchWorkspaceOfMember';
import { useAuth } from '@/hooks/context/useAuth';

import { DefaultWorkspacePage } from './DefaultWorkspacePage';

export const Home = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { isFetching, Workspaces, error } = useFetchWorkspaceOfMember();
    
    useEffect(() => {
        if (isFetching) return;
        
        if (error?.status === 403) {
            console.log('Token expired or unauthorized. Redirecting to signin...');
            logout();
            navigate('/auth/signin');
            return;
        }

        /* check local storage data is user has token in the local storage or not */
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (!token || !user) {
            console.log('No token found. Redirecting to signin...');
            logout();
            navigate('/auth/signin');
            return;
        }

        console.log('Workspaces:', Workspaces);
        // If user has workspaces, redirect to the first one
        if (token && user && Workspaces?.length > 0) {
            navigate('/workspace');
        }
    }, [isFetching, Workspaces, error, navigate, logout]);

    if (isFetching) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Loader2Icon className="size-10 animate-spin" />
            </div>
        );
    }

    // Show default page only when there are no workspaces
    if (!Workspaces || Workspaces.length === 0) {
        return <DefaultWorkspacePage />;
    }

    // This return is a fallback, should not be reached in normal flow
    return null;
};