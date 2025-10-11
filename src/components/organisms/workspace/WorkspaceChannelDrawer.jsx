import { ArrowLeft, HashIcon, Loader, Settings, TriangleAlertIcon, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { UserItem } from '@/components/atoms/UserItem/UserItem';
import { UnifiedPanelHeader } from '@/components/molecules/Common/UnifiedPanelHeader';
import { WorkspaceDetailsDrawer } from '@/components/organisms/workspace/WorkspaceDetailsDrawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetWorkspaceById } from '@/hooks/api/workspace/useGetWorkspaceById';
import { useCreateChannelContext } from '@/hooks/context/useCreateChannelContext';

export const WorkspaceChannelDrawer = ({ open, workspaceId, onClose }) => {
    const { channelId } = useParams();
    const { setOpenCreateChannelModal } = useCreateChannelContext();
    const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { isFetching, isSuccess, workspaceDetails } = useGetWorkspaceById(workspaceId);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const menuItems = [
        {
            label: 'Workspace Settings',
            icon: <Settings className='size-4' />,
            onClick: () => setShowDetailsDrawer(true)
        },
        {
            label: 'Invite Members',
            icon: <UserPlus className='size-4' />,
            onClick: () => console.log('Invite members')
        },
        {
            label: 'Back to Workspaces',
            icon: <ArrowLeft className='size-4' />,
            onClick: onClose
        }
    ];

    // Filter channels based on search
    const filteredChannels = workspaceDetails?.channels?.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Overlay - covers only the panel area */}
            <div 
                className={`absolute inset-0 bg-black/40 z-10 transition-opacity duration-300 ${
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />
            
            {/* Drawer - slides over the panel */}
            <div className={`absolute inset-0 bg-slack-medium border-r border-slate-700 shadow-2xl z-20 transform transition-transform duration-300 ease-in-out overflow-hidden ${
                open ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {/* Unified Header */}
                {!isFetching && (
                    <UnifiedPanelHeader
                        appName='Channels'
                        workspaceName={workspaceDetails?.name}
                        onAddClick={() => setOpenCreateChannelModal(true)}
                        addButtonLabel='Create Channel'
                        menuItems={menuItems}
                        onSearch={handleSearch}
                        searchPlaceholder='Search channels...'
                        showBackButton={true}
                        onBackClick={onClose}
                    />
                )}

                {/* Content */}
                <ScrollArea className={isFetching ? 'h-full' : 'h-[calc(100vh-128px)]'}>
                    {isFetching ? (
                        <div className='flex items-center justify-center py-8'>
                            <Loader className='animate-spin size-6 text-white' />
                        </div>
                    ) : !isSuccess ? (
                        <div className='flex flex-col items-center justify-center py-8 gap-2'>
                            <TriangleAlertIcon className='size-8 text-red-500' />
                            <p className='text-sm text-slate-400'>Failed to load workspace</p>
                        </div>
                    ) : (
                        <div className='py-2'>
                            {/* Channels List */}
                            <div className='px-2'>
                                {filteredChannels?.length === 0 ? (
                                    <div className='flex flex-col items-center justify-center py-8 px-4'>
                                        <HashIcon className='size-12 text-slate-600 mb-3' />
                                        <p className='text-sm text-slate-400 text-center mb-2'>
                                            No channels yet
                                        </p>
                                        <p className='text-xs text-slate-500 text-center mb-4'>
                                            Create your first channel to get started
                                        </p>
                                        <button
                                            onClick={() => setOpenCreateChannelModal(true)}
                                            className='px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2'
                                        >
                                            <HashIcon className='size-4' />
                                            Create Channel
                                        </button>
                                    </div>
                                ) : (
                                    filteredChannels?.map((channel) => {
                                        return (
                                            <UserItem
                                                key={channel._id}
                                                id={channel._id}
                                                type='channel'
                                                label={channel.name}
                                                variant={channelId === channel._id ? 'active' : 'default'}
                                                Icon={HashIcon}
                                            />
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </ScrollArea>

                {/* Workspace Details Drawer - slides from top */}
                <WorkspaceDetailsDrawer
                    open={showDetailsDrawer}
                    workspace={workspaceDetails}
                    onClose={() => setShowDetailsDrawer(false)}
                />
            </div>
        </>
    );
};
