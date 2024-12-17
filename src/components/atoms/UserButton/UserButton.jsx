import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { LogOutIcon, PencilIcon, SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/context/useAuth';
import { useWorkspaceCreateModal } from '@/hooks/context/useWorkspaceCreateModal';
import { useToast } from '@/hooks/use-toast';

export const UserButton = () => {
    
    const { toast } = useToast();
    const navigate = useNavigate();
    const { auth, logout }  = useAuth();

    const { setOpenWorkspaceCreateModal } = useWorkspaceCreateModal();

    async function handleLogout(){
        await logout();

        toast({
            variant: 'success',
            title: 'Successfully Logged Out',
        });

        navigate('/auth/signin');
    }

    function handleOpenWorkspaceCreateModal(){
        setTimeout(() => {
            setOpenWorkspaceCreateModal(true);
        },100);
    }
    return(
        <DropdownMenu>
            <DropdownMenuTrigger className='outline-none relative'>
                <Avatar className='size-10 hover:opacity-65 transition'>
                    <AvatarImage className='size-10 mr-2 h-10' src='https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg' />
                    <AvatarFallback>{auth?.user?.username[0].toUpperCase() }</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuItem onClick={handleOpenWorkspaceCreateModal}>
                <PencilIcon className='size-5 mr-2 h-10'/> 
                New Group
            </DropdownMenuItem>
            <DropdownMenuItem>
                <SettingsIcon className='size-5 mr-2 h-10'/>
                Setting
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
                <LogOutIcon className='size-5 mr-2 h-10'/>
                Logout
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};