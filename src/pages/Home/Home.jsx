import { Loader2Icon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { useFetchWorkspaceOfMember } from '@/hooks/api/workspace/useFetchWorkspaceOfMember';
import { useAuth } from '@/hooks/context/useAuth';
import { useWorkspaceCreateModal } from '@/hooks/context/useWorkspaceCreateModal';

export const Home = () => {

    const { logout } = useAuth();
    const navigate = useNavigate();

    const { setOpenWorkspaceCreateModal } = useWorkspaceCreateModal();

    const { isFetching, Workspaces, error } = useFetchWorkspaceOfMember();
    
    useEffect(() => {
        if(isFetching) return;
        
        if (error?.status === 403) {
            console.log('Token expired or unauthorized. Redirecting to signin...');
            logout();
            navigate('/auth/signin');
            return;
        }

        if (Workspaces.length === 0 && !Workspaces) {
            setOpenWorkspaceCreateModal(true);
        } else {
            navigate(`/workspace/${Workspaces[0]._id}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isFetching,
        Workspaces,
        error,
        navigate
    ]);

    if (isFetching) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Loader2Icon className="size-10 animate-spin" />
            </div>
        );
    }
    return(
        <>
            <UserButton/>
        </>
    );
};