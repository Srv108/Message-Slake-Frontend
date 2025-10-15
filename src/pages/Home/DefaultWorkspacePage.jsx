import { AnimatePresence, motion } from 'framer-motion';
import { Lock, MessageCircle, MessageSquare, Moon, Shield, Sun, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { ActionButton } from '@/components/ui/ActionButton';
import { Button } from '@/components/ui/button';
import { useCreateRoom } from '@/hooks/api/room/useCreateRoom';
import { useAddMemberContext } from '@/hooks/context/useAddMemberContext';
import { useTheme } from '@/hooks/context/useTheme';
import { useWorkspaceCreateModal } from '@/hooks/context/useWorkspaceCreateModal';

export const DefaultWorkspacePage = () => {
    const { setOpenWorkspaceCreateModal } = useWorkspaceCreateModal();
    const { theme, toggleTheme } = useTheme();
    const [isMobile, setIsMobile] = useState(false);
    const { setOpenAddMemberModal, setIsPending, setFormSubmitHandler } = useAddMemberContext();
    const { isPending, createRoomMutation } = useCreateRoom();

    async function formHandlerFunction(username) {
        try {
            await createRoomMutation({ username });
        } catch (error) {
            console.log('error in create room:', error);
        }
    }

    useEffect(() => {
        setIsPending(isPending);
    }, [isPending]);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleCreateWorkspace = () => setOpenWorkspaceCreateModal(true);
    const handleAddMember = () => {
        setOpenAddMemberModal(true);
        setFormSubmitHandler(() => formHandlerFunction);
    };

    const FloatingActions = () => {
        const [isProfileHovered, setIsProfileHovered] = useState(false);

        return (
            <div className="fixed right-5 bottom-10 flex flex-col items-center space-y-5 z-50">
                {/* Profile Button */}
                <div className="relative">
                    <div 
                        className={`w-8 h-8 md:w-14 md:h-14 rounded-full bg-gray-700 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 
                            flex items-center justify-center transition-all cursor-pointer`}
                        onClick={() => document.querySelector('#user-button').click()}
                        onMouseEnter={() => setIsProfileHovered(true)}
                        onMouseLeave={() => setIsProfileHovered(false)}
                    >
                        <UserButton 
                            className="w-full h-full" 
                            style={{ pointerEvents: 'none' }}
                            id="user-button"
                        />
                    </div>
                    <AnimatePresence>
                        {isProfileHovered && (
                            <motion.div 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 5 }}
                                className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-800 dark:bg-gray-700 text-white text-sm px-3 py-1.5 rounded whitespace-nowrap z-50 shadow-lg"
                            >
                                Profile
                                <div className="absolute right-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-800 dark:bg-gray-700 rotate-45"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Other Action Buttons */}
                <ActionButton
                    icon={theme === 'dark' ? Sun : Moon}
                    label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    onClick={toggleTheme}
                    color="bg-gray-700 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                />
                <ActionButton
                    icon={MessageCircle}
                    label="New Chat"
                    onClick={handleAddMember}
                    color="bg-emerald-500 hover:bg-emerald-600"
                />
                <ActionButton
                    icon={Users}
                    label="New Group"
                    onClick={handleCreateWorkspace}
                    color="bg-blue-500 hover:bg-blue-600"
                />
            </div>
        );
    };

    // DESKTOP VIEW
    if (!isMobile) {
        return (
            <div className="min-h-screen w-full flex bg-gray-50 dark:bg-[#0d1117] relative transition-colors duration-300">
                {/* Left Welcome Section */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="bg-white dark:bg-[#161b22] rounded-2xl shadow-lg p-10 w-full max-w-md text-center transition-all">
                        <div className="mx-auto w-24 h-24 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-6">
                            <MessageSquare className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3 text-gray-800 dark:text-white">
                            Welcome to MessageSlake
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Secure and fast messaging – just like Telegram or WhatsApp.
                        </p>

                        <div className="space-y-4">
                            <Button
                                onClick={handleAddMember}
                                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl text-base"
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                New Chat
                            </Button>
                            <Button
                                onClick={handleCreateWorkspace}
                                className="w-full py-5 bg-white dark:bg-[#21262d] hover:bg-gray-50 dark:hover:bg-[#2d333b] text-emerald-600 dark:text-white border border-emerald-200 dark:border-gray-700 font-medium rounded-xl text-base"
                            >
                                <Users className="w-5 h-5 mr-2" />
                                New Group
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Overview Section */}
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-[#161b22] dark:to-[#1b222b] p-10 transition-all">
                    <div className="max-w-lg">
                        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
                            Connect & Collaborate
                        </h2>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: Shield,
                                    title: 'End-to-End Encryption',
                                    text: 'Your chats are protected by advanced encryption.'
                                },
                                {
                                    icon: Users,
                                    title: 'Group Chats',
                                    text: 'Collaborate with teams and friends easily.'
                                },
                                {
                                    icon: MessageSquare,
                                    title: 'Minimal & Elegant',
                                    text: 'Designed for simplicity and focus.'
                                },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mr-4">
                                        <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <FloatingActions />
            </div>
        );
    }

    // Inside the "mobile view" block
    return (
    <div
        className={`min-h-screen w-full flex flex-col justify-center items-center text-center relative px-6 overflow-hidden transition-colors duration-500
        ${theme === 'dark'
            ? 'bg-gradient-to-br from-[#0c0f13] via-[#11161d] to-[#0a0d11]'
            : 'bg-gradient-to-br from-emerald-50 via-white to-blue-50'
        }`}
    >

        {/* Logo Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
        {theme === 'dark' ? (
            <div className="w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />
        ) : (
            <div className="w-64 h-64 rounded-full bg-emerald-200/40 blur-3xl" />
        )}
        </div>

        {/* Main Section */}
        <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
        >
        <div
            className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-lg transition-colors duration-500
            ${theme === 'dark'
                ? 'bg-[#141b22] shadow-emerald-900/40'
                : 'bg-white shadow-emerald-200/70'
            }`}
        >
            <MessageSquare
            className={`w-12 h-12 transition-colors duration-500 ${
                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
            }`}
            />
        </div>

        <h1
            className={`text-3xl font-extrabold mb-3 tracking-wide transition-colors duration-500 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
        >
            MessageSlake
        </h1>
        <p
            className={`text-base leading-relaxed mb-2 transition-colors duration-500 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
        >
            Chat securely with friends, family, or your team.
        </p>
        <p
            className={`flex items-center justify-center gap-2 mt-4 text-sm transition-colors duration-500 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}
        >
            <Lock className="w-4 h-4" /> End-to-end encrypted
        </p>
        </motion.div>

        {/* Floating Buttons */}
        <div className="fixed right-5 bottom-10 flex flex-col items-center space-y-5 z-50">
        <ActionButton
            icon={theme === 'dark' ? Sun : Moon}
            label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            onClick={toggleTheme}
            color={
            theme === 'dark'
                ? 'bg-gray-800/80 hover:bg-gray-700 shadow-black/40'
                : 'bg-gray-100 hover:bg-gray-200 shadow-gray-300/60'
            }
        />
        <ActionButton
            icon={MessageCircle}
            label="New Chat"
            onClick={handleAddMember}
            color={
            theme === 'dark'
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-900/50'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-300/70'
            }
        />
        <ActionButton
            icon={Users}
            label="New Group"
            onClick={handleCreateWorkspace}
            color={
            theme === 'dark'
                ? 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-900/50'
                : 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-300/70'
            }
        />
        </div>
    </div>
    );

};
