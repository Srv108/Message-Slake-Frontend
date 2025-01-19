import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export const HomeLayout = ({ 
    Panel,
    Navbar,
    Sidebar,
    children
}) => {

    return(
        <div className="h-[100vh]">
            {Navbar && <Navbar />}
            <div 
                className={(Navbar) ? 'flex h-[calc(100vh-40px)]' : 'flex h-screen'}
            >
                <Sidebar />

                <ResizablePanelGroup
                    direction="horizontal"
                    autoSaveId={'workspace-resize'}
                >
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className='bg-slack-medium'
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
        </div>
    );
};