import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { UserCircle } from 'lucide-react';
import { useState } from 'react';

import { UserProfileDrawer } from '@/components/molecules/UserProfileDrawer/UserProfileDrawer';
import { AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/context/useAuth';

export const UserButton = ({ isMobile, activeTab, setActiveTab }) => {
    const { auth } = useAuth();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleClick = () => {
        if (isMobile && setActiveTab) {
            setActiveTab('profile');
        }
        setIsDrawerOpen(true);
    };

    // Mobile tab view
    if (isMobile) {
        return (
            <>
                <button
                    onClick={handleClick}
                    className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                        activeTab === 'profile'
                            ? 'text-teal-600 dark:text-teal-400'
                            : 'text-gray-600 dark:text-slate-400'
                    }`}
                >
                    <UserCircle className={`w-6 h-6 mb-1 ${activeTab === 'profile' ? 'scale-110' : ''} transition-transform`} />
                    <span className={`text-xs font-medium ${activeTab === 'profile' ? 'font-semibold' : ''}`}>
                        Profile
                    </span>
                </button>
                
                <UserProfileDrawer 
                    open={isDrawerOpen}
                    onOpenChange={setIsDrawerOpen}
                    isMobile={true}
                />
            </>
        );
    }

    // Desktop view
    return (
        <>
            <button 
                onClick={handleClick}
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
                isMobile={false}
            />
        </>
    );
};