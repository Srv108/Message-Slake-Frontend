import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { HomePage } from '@/pages/Room/HomePage';

export const HomeLayout = ({ 
    Panel,
    Navbar,
    Sidebar,
    children
}) => {

    const { roomId, channelId } = useParams();
    const location = useLocation();
    const [showChatOnMobile, setShowChatOnMobile] = useState(false);
    
    // Check if any tab is selected based on current route
    const isTabSelected = location.pathname.includes('/directMessages') || 
                         location.pathname.includes('/home') || 
                         location.pathname.includes('/workspace');

    // Show chat component when user/channel is selected on mobile
    useEffect(() => {
        if (roomId || channelId) {
            setShowChatOnMobile(true);
        } else {
            setShowChatOnMobile(false);
        }
    }, [roomId, channelId]);

    return(
        <div className="h-[100vh]">
            {Navbar && <Navbar />}
            <div 
                className={(Navbar) ? 'flex h-[calc(100vh-40px)] md:h-[calc(100vh-40px)]' : 'flex h-screen md:h-screen'}
            >
                {/* Hide Sidebar on mobile when chat is open */}
                <div className={showChatOnMobile ? 'hidden md:block' : 'block'}>
                    <Sidebar />
                </div>

                {/* Desktop Layout - Resizable Panels */}
                <div className="hidden md:flex flex-1">
                    <ResizablePanelGroup
                        direction="horizontal"
                        autoSaveId={'workspace-resize'}
                    >
                        <ResizablePanel
                            defaultSize={20}
                            minSize={11}
                            className='bg-gray-900'
                        >
                            { Panel && <Panel />}
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        <ResizablePanel
                            minSize={20}
                        >
                            {children}
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>

                {/* Mobile Layout - Conditional view based on selection */}
                <div className={`md:hidden flex flex-col flex-1 ${showChatOnMobile ? '' : 'pb-16'}`}>
                    {/* Show HomePage when no tab is selected (first time) */}
                    {!isTabSelected && !showChatOnMobile && (
                        <div className="flex-1 overflow-hidden animate-in fade-in duration-500">
                            <HomePage />
                        </div>
                    )}
                    
                    {/* Show Panel (user list) when tab is selected but no chat is open */}
                    {isTabSelected && !showChatOnMobile && (
                        <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-left duration-300">
                            { Panel && <Panel />}
                        </div>
                    )}
                    
                    {/* Show Chat component when user/channel is selected - Full screen with animation */}
                    {showChatOnMobile && (
                        <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-right duration-500">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};