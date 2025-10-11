import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useState } from 'react';

import { UserProfileDrawer } from '@/components/molecules/UserProfileDrawer/UserProfileDrawer';
import { AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/context/useAuth';

export const UserButton = () => {
    const { auth } = useAuth();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsDrawerOpen(true)}
                className='outline-none relative'
            >
                <Avatar className='size-10 hover:opacity-65 transition cursor-pointer'>
                    <AvatarImage className='size-10 mr-2 h-10 rounded-3xl' src={auth?.user?.avatar} />
                    <AvatarFallback className='size-10 mr-2 h-10 font-semibold text-3xl rounded-3xl'>
                        {auth?.user?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
            </button>
            
            <UserProfileDrawer 
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
            />
        </>
    );
};