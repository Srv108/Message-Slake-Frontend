import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { UserCircle } from 'lucide-react';
import { useState } from 'react';

import { UserProfileDrawer } from '@/components/molecules/UserProfileDrawer/UserProfileDrawer';
import { AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/context/useAuth';

export const UserButton = ({ isMobile, activeTab, setActiveTab, size=12, className = 'w-full h-full' }) => {
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
                    className={`flex flex-col items-center justify-center flex-1 ${className} transition-colors ${
                        activeTab === 'profile'
                            ? 'text-teal-600 dark:text-teal-400'
                            : 'text-gray-600 dark:text-slate-400'
                    }`}
                >
                    {auth?.user?.profilePic ? (
                    <Avatar className={`w-${size} h-${size}`}>
                        <AvatarImage 
                            src={auth.user.profilePic} 
                            alt={auth.user.username} 
                            className="w-full h-full rounded-full object-cover"
                        />
                        <AvatarFallback className="w-full h-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                            <UserCircle className={`w-${size/2} h-${size/2}`} />
                        </AvatarFallback>
                    </Avatar>
                ) : (
                    <div className={`w-${size} h-${size} rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center`}>
                        <UserCircle className={`w-${size/2} h-${size/2} text-emerald-600 dark:text-emerald-400`} />
                    </div>
                )}
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