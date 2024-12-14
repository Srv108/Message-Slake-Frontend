import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { LogOutIcon, SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/context/useAuth';
import { useToast } from '@/hooks/use-toast';

export const UserButton = () => {
    
    const { auth, logout }  = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    async function handleLogout(){
        await logout();

        toast({
            variant: 'success',
            title: 'Successfully Logged Out',
        });

        navigate('/auth/signin');
    }

    console.log(auth.user.avatar);

    return(
        <DropdownMenu>
            <DropdownMenuTrigger className='outline-none relative'>
                <Avatar className='size-10 hover:opacity-65 transition'>
                    <AvatarImage className='' src={auth?.user?.avatar} />
                    <AvatarFallback>{auth?.user?.username[0].toUpperCase() }</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuItem>
                Profile
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