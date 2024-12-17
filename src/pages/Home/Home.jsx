import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { Button } from '@/components/ui/button';
import { useWorkspaceCreateModal } from '@/hooks/context/useWorkspaceCreateModal';

export const Home = () => {

    const { setOpenWorkspaceCreateModal } = useWorkspaceCreateModal();

    function handleOpenWorkspaceCreateModal(){
        setOpenWorkspaceCreateModal(true);
    }
    return(
        <>
            <h1> Welcome to the Home page</h1>
            <UserButton/>
            <Button onClick={handleOpenWorkspaceCreateModal} >Open</Button>
        </>
    );
};