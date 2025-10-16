import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { UserCircle } from 'lucide-react';
import { useState } from 'react';

import { UserProfileDrawer } from '@/components/molecules/UserProfileDrawer/UserProfileDrawer';
import { AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/context/useAuth';

export const UserButton = ({
    isMobile,
    activeTab,
    setActiveTab,
    size = 12,
    className = '',
    buttonClassName = '',
    onClick, // Optional external click (used in DefaultWorkspacePage)
    ...props
}) => {
    const { auth } = useAuth();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleClick = (e) => {
        if (onClick) onClick(e); // external handler if provided
        if (isMobile && setActiveTab) setActiveTab('profile');
        setIsDrawerOpen(true);
    };

    // ✅ MOBILE TAB VIEW
    if (isMobile) {
        return (
            <>
                <button
                    onClick={handleClick}
                    className={`flex flex-col items-center justify-center flex-1 transition-colors ${className} ${
                        activeTab === 'profile'
                            ? 'text-teal-600 dark:text-teal-400'
                            : 'text-gray-600 dark:text-slate-400'
                    }`}
                    {...props}
                >
                    {auth?.user?.profilePic ? (
                        <Avatar className={`w-${size} h-${size}`}>
                            <AvatarImage
                                src={auth.user.avatar}
                                alt={auth.user.username}
                                className="w-full h-full rounded-full object-cover"
                            />
                            <AvatarFallback className="w-full h-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                <UserCircle className={`w-${size / 2} h-${size / 2}`} />
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <div
                            className={`w-${size} h-${size} rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center`}
                        >
                            <UserCircle
                                className={`w-${size / 2} h-${size / 2} text-emerald-600 dark:text-emerald-400`}
                            />
                        </div>
                    )}
                    <span
                        className={`text-xs font-medium ${
                            activeTab === 'profile' ? 'font-semibold' : ''
                        }`}
                    >
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

    // ✅ DESKTOP VIEW — styled like ActionButton or SidebarButton
    return (
        <>
            <button
                id="user-button"
                onClick={handleClick}
                className={`relative flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all cursor-pointer focus:outline-none w-${size} h-${size} ${buttonClassName}`}
                style={{ width: `${size}px`, height: `${size}px` }}
                {...props}
            >
                {auth?.user?.avatar ? (
                    <Avatar className="w-full h-full">
                        <AvatarImage
                            src={auth.user.avatar}
                            alt={auth.user.username}
                            className="rounded-full object-cover w-full h-full"
                        />
                        <AvatarFallback className="flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full w-full h-full text-lg font-semibold">
                            {auth?.user?.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                ) : (
                    <UserCircle className="w-5 h-5 text-white" />
                )}
            </button>

            <UserProfileDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                isMobile={false}
            />
        </>
    );
};
