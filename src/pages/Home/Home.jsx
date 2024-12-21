import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { useFetchWorkspaceOfMember } from '@/hooks/api/workspace/useFetchWorkspaceOfMember';
import { useWorkspaceCreateModal } from '@/hooks/context/useWorkspaceCreateModal';

export const Home = () => {

    const navigate = useNavigate();

    const { setOpenWorkspaceCreateModal } = useWorkspaceCreateModal();

    const { isFetching, Workspaces} = useFetchWorkspaceOfMember();

    useEffect(() => {
        if(isFetching) return;
        console.log('Workspaces download is',Workspaces);

        if(Workspaces.length === 0 || !Workspaces){
            setOpenWorkspaceCreateModal(true);
        }else{
            navigate(`/workspace/${Workspaces[0]._id}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[Workspaces, isFetching, navigate]);
    return(
        <>
            <UserButton/>
        </>
    );
};