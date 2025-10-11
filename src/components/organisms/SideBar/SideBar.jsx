import  { MessageSquareText, Phone, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { SidebarButton } from '@/components/molecules/SidebarButton/SidebarButton';

export const SideBar = ({
    WorkspaceSwitcher
}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(null); // null = no tab selected (first time)

    // Set active tab based on current route
    useEffect(() => {
        if (location.pathname.includes('/directMessages')) {
            setActiveTab('chats');
        } else if (location.pathname.includes('/home') || location.pathname.includes('/workspace')) {
            setActiveTab('groups');
        }
        // Don't set default - let it be null on first load
    }, [location.pathname]);

    const handleTabClick = (tab, path) => {
        setActiveTab(tab);
        navigate(path);
    };

    return (
        <>
            {/* Desktop Sidebar - Left side */}
            <aside
                className="hidden md:flex w-[70px] h-full bg-gray-100 dark:bg-slack-dark flex-col gap-y-5 items-center pt-[10px] pb-[5px]"
            >
                {(WorkspaceSwitcher) && <WorkspaceSwitcher />}

                <SidebarButton
                    Icon={MessageSquareText}
                    label="Chats"
                    iconOnClick={() => {
                        navigate('/directMessages');
                    }}
                />
                
                <SidebarButton 
                    Icon={Users}
                    label="Groups"
                    iconOnClick={() => {
                        navigate('/home');
                    }}
                />

                <SidebarButton
                    Icon={Phone}
                    label="More"
                />
                <div className='flex flex-col items-center justify-center mt-auto mb-5 gap-y-1'>
                    <UserButton />
                </div>
            </aside>

            {/* Mobile Bottom Tab Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slack-dark border-t border-gray-200 dark:border-slate-700 shadow-lg">
                <div className="flex items-center justify-around h-16 px-2">
                    {/* Chats Tab */}
                    <button
                        onClick={() => handleTabClick('chats', '/directMessages')}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            activeTab === 'chats'
                                ? 'text-teal-600 dark:text-teal-400'
                                : 'text-gray-600 dark:text-slate-400'
                        }`}
                    >
                        <MessageSquareText className={`w-6 h-6 mb-1 ${activeTab === 'chats' ? 'scale-110' : ''} transition-transform`} />
                        <span className={`text-xs font-medium ${activeTab === 'chats' ? 'font-semibold' : ''}`}>
                            Chats
                        </span>
                    </button>

                    {/* Groups Tab */}
                    <button
                        onClick={() => handleTabClick('groups', '/home')}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            activeTab === 'groups'
                                ? 'text-teal-600 dark:text-teal-400'
                                : 'text-gray-600 dark:text-slate-400'
                        }`}
                    >
                        <Users className={`w-6 h-6 mb-1 ${activeTab === 'groups' ? 'scale-110' : ''} transition-transform`} />
                        <span className={`text-xs font-medium ${activeTab === 'groups' ? 'font-semibold' : ''}`}>
                            Groups
                        </span>
                    </button>

                    {/* Calls Tab */}
                    <button
                        onClick={() => setActiveTab('calls')}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            activeTab === 'calls'
                                ? 'text-teal-600 dark:text-teal-400'
                                : 'text-gray-600 dark:text-slate-400'
                        }`}
                    >
                        <Phone className={`w-6 h-6 mb-1 ${activeTab === 'calls' ? 'scale-110' : ''} transition-transform`} />
                        <span className={`text-xs font-medium ${activeTab === 'calls' ? 'font-semibold' : ''}`}>
                            Calls
                        </span>
                    </button>

                    {/* Profile Tab */}
                    <UserButton isMobile={true} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </nav>
        </>
    );
};