import { LogOutIcon, Moon, Palette, PencilIcon, SettingsIcon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChatThemeSelector } from '@/components/molecules/Room/ChatThemeSelector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/context/useAuth';
import { useTheme } from '@/hooks/context/useTheme';
import { useWorkspaceCreateModal } from '@/hooks/context/useWorkspaceCreateModal';
import { useToast } from '@/hooks/use-toast';

export const UserProfileDrawer = ({ open, onOpenChange }) => {
    const { auth, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { setOpenWorkspaceCreateModal } = useWorkspaceCreateModal();

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    async function handleLogout() {
        await logout();
        onOpenChange(false);
        toast({
            variant: 'success',
            title: 'Successfully Logged Out',
        });
        navigate('/auth/signin');
    }

    function handleOpenWorkspaceCreateModal() {
        onOpenChange(false);
        setTimeout(() => {
            setOpenWorkspaceCreateModal(true);
        }, 100);
    }

    // Generate initials from username
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-500 ease-in-out ${
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => onOpenChange(false)}
            />
            
            {/* Drawer */}
            <div className={`fixed left-0 top-0 h-full w-full md:w-1/2 lg:w-2/5 max-w-2xl bg-slack-medium border-r border-slate-700 shadow-2xl z-50 overflow-y-auto transform transition-all duration-500 ease-in-out ${
                open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}>
                {/* Close Button */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-700/50 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-slate-300" />
                </button>

                {/* Profile Header */}
                <div className="relative bg-gradient-to-b from-teal-600/20 to-transparent pt-16 pb-8">
                    <div className="flex flex-col items-center">
                        <Avatar className="w-32 h-32 ring-4 ring-teal-500/30">
                            <AvatarImage src={auth?.user?.avatar} alt={auth?.user?.username} />
                            <AvatarFallback className="bg-teal-600 text-white text-4xl font-bold">
                                {getInitials(auth?.user?.username)}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="mt-4 text-2xl font-semibold text-slate-100">
                            {auth?.user?.username || 'User'}
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">
                            {auth?.user?.email || 'No email'}
                        </p>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="px-6 py-4 space-y-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                    >
                        <div className="p-2 bg-slate-800 rounded-lg">
                            {theme === 'dark' ? (
                                <Moon className="w-5 h-5 text-blue-400" />
                            ) : (
                                <Sun className="w-5 h-5 text-yellow-400" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-slate-200 font-medium">Theme</p>
                            <p className="text-xs text-slate-400">
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </p>
                        </div>
                        <div className="text-slate-400 text-sm">
                            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                        </div>
                    </button>

                    {/* New Group */}
                    <button
                        onClick={handleOpenWorkspaceCreateModal}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                    >
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <PencilIcon className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-slate-200 font-medium">New Group</p>
                            <p className="text-xs text-slate-400">Create a new workspace</p>
                        </div>
                    </button>

                    {/* Chat Theme */}
                    <button
                        onClick={() => setIsThemeSelectorOpen(true)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                    >
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <Palette className="w-5 h-5 text-pink-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-slate-200 font-medium">Chat Theme</p>
                            <p className="text-xs text-slate-400">Customize chat background</p>
                        </div>
                    </button>

                    {/* Settings */}
                    <button
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                    >
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <SettingsIcon className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-slate-200 font-medium">Settings</p>
                            <p className="text-xs text-slate-400">Manage your preferences</p>
                        </div>
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-500/10 rounded-lg transition-colors text-left border-t border-slate-700 mt-4 pt-4"
                    >
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <LogOutIcon className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-red-400 font-medium">Logout</p>
                            <p className="text-xs text-slate-400">Sign out of your account</p>
                        </div>
                    </button>
                </div>

                {/* Footer Info */}
                <div className="px-6 py-4 mt-auto border-t border-slate-700">
                    <div className="text-xs text-slate-500 space-y-1">
                        <p>Version 1.0.0</p>
                        <p>© 2024 MessageSlake. All rights reserved.</p>
                    </div>
                </div>
            </div>

            {/* Chat Theme Selector */}
            <ChatThemeSelector 
                open={isThemeSelectorOpen}
                onOpenChange={setIsThemeSelectorOpen}
            />
        </>
    );
};
