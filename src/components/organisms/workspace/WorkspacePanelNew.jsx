import { ChevronRight, Loader, LogOut, Settings, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { UnifiedPanelHeader } from '@/components/molecules/Common/UnifiedPanelHeader';
import { WorkspaceChannelDrawer } from '@/components/organisms/workspace/WorkspaceChannelDrawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFetchWorkspaceOfMember } from '@/hooks/api/workspace/useFetchWorkspaceOfMember';
import { useWorkspaceCreateModal } from '@/hooks/context/useWorkspaceCreateModal';

export const WorkspacePanelNew = () => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    
    // State to track which workspace drawer is open
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaceId || null);

    // Fetch all workspaces
    const { isFetching: isLoadingWorkspaces, Workspaces } = useFetchWorkspaceOfMember();

    const { setOpenWorkspaceCreateModal } = useWorkspaceCreateModal();
    
    const [searchQuery, setSearchQuery] = useState('');
    // Sync selected workspace with URL
    useEffect(() => {
        if (workspaceId) {
            setSelectedWorkspaceId(workspaceId);
        } else {
            setSelectedWorkspaceId(null);
        }
    }, [workspaceId]);

    const handleWorkspaceClick = (workspace) => {
        if (!workspace || !workspace._id) return; 
        setSelectedWorkspaceId(workspace._id);
        // Navigate to workspace (without channel)
        navigate(`/workspace/${workspace._id}`);
    };

    const handleCloseDrawer = () => {
        setSelectedWorkspaceId(null);
        navigate('/workspace');
    };

    if (isLoadingWorkspaces) {
        return (
            <div className='flex flex-col gap-y-2 h-full items-center justify-center bg-white dark:bg-slack-medium'>
                <Loader className='animate-spin size-6 text-gray-900 dark:text-white' />
            </div>
        );
    }

    function handleAddWorkspace(){
        setOpenWorkspaceCreateModal(true);
    }

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const menuItems = [
        {
            label: 'Settings',
            icon: <Settings className='size-4' />,
            onClick: () => console.log('Settings clicked')
        },
        {
            label: 'Invite Friends',
            icon: <UserPlus className='size-4' />,
            onClick: () => console.log('Invite clicked')
        },
        {
            label: 'Logout',
            icon: <LogOut className='size-4' />,
            onClick: () => console.log('Logout clicked')
        }
    ];

    // Filter workspaces based on search
    const filteredWorkspaces = Workspaces?.filter(workspace =>
        workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const validWorkspace = Workspaces?.some(w => w._id === selectedWorkspaceId);

    return (
        <div className='relative flex flex-col h-full bg-white dark:bg-slack-medium overflow-hidden'>
            {/* Header */}
            <UnifiedPanelHeader
                appName='Message Slake'
                onAddClick={handleAddWorkspace}
                addButtonLabel='New Workspace'
                menuItems={menuItems}
                onSearch={handleSearch}
                searchPlaceholder='Search workspaces...'
            />

            {/* Workspaces List */}
            <ScrollArea className='h-[calc(100vh-128px)]'>
                <div className='flex flex-col py-2'>
                    {filteredWorkspaces?.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-12 px-4'>
                            <p className='text-sm text-gray-600 dark:text-slate-400 text-center mb-2'>
                                No workspaces found
                            </p>
                            <p className='text-xs text-gray-500 dark:text-slate-500 text-center'>
                                Create or join a workspace to get started
                            </p>
                        </div>
                    ) : (
                        filteredWorkspaces?.map((workspace) => {
                            const isActive = workspaceId === workspace._id;

                            return (
                                <button
                                    key={workspace._id}
                                    onClick={() => handleWorkspaceClick(workspace)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-all group ${
                                        isActive ? 'bg-gray-200 dark:bg-slate-700/30 border-l-4 border-teal-500' : 'border-l-4 border-transparent'
                                    }`}
                                >
                                    {/* Workspace Icon */}
                                    <div className={`size-12 relative overflow-hidden text-white font-semibold text-xl rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                        isActive ? 'bg-teal-600' : 'bg-gray-400 dark:bg-[#616061] group-hover:bg-gray-500 dark:group-hover:bg-[#707070]'
                                    }`}>
                                        {workspace.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Workspace Info */}
                                    <div className='flex-1 text-left min-w-0'>
                                        <p className={`font-medium truncate ${
                                            isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-800 dark:text-slate-100'
                                        }`}>
                                            {workspace.name}
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-slate-400 truncate'>
                                            {workspace.channels?.length || 0} channel{workspace.channels?.length !== 1 ? 's' : ''} • {workspace.members?.length || 0} member{workspace.members?.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    {/* Arrow Icon */}
                                    <ChevronRight className={`size-5 shrink-0 transition-all ${
                                        isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-300'
                                    }`} />
                                </button>
                            );
                        })
                    )}
                </div>
            </ScrollArea>

            {/* Channel Drawer */}
            <WorkspaceChannelDrawer
                open={Boolean(validWorkspace && selectedWorkspaceId)}
                workspaceId={validWorkspace ? selectedWorkspaceId : null}
                onClose={handleCloseDrawer}
            />
        </div>
    );
};
