import { HashIcon, Loader, MessageSquareTextIcon, SendHorizonalIcon, TriangleAlertIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { SideBarItem } from '@/components/atoms/SideBarItem/SideBarItem';
import { WorkspacePanelHeaders } from '@/components/molecules/Workspace/WorkspacePanelHeaders';
import { WorkspacePanelSection } from '@/components/molecules/Workspace/WorkspacePanelSection';
import { useGetWorkspaceById } from '@/hooks/api/workspace/useGetWorkspaceById';
import { useCreateChannelContext } from '@/hooks/context/useCreateChannelContext';

export const WorkspacePanel = () => {

    const { workspaceId } = useParams();
    const { setOpenCreateChannelModal } = useCreateChannelContext();

    const { isFetching, isSuccess, workspaceDetails } = useGetWorkspaceById(workspaceId);

    if(isFetching){
        return (
            <div
                className='flex flex-col gap-y-2 h-full items-center justify-center text-white'
            >
                <Loader className='animate-spin size-6 text-white'/>
            </div>
        );
    }

    if(!isSuccess){
        return (
            <div
                className='flex flex-col gap-y-2 h-full items-center justify-center text-white'
            >
                <TriangleAlertIcon className='size-8 text-red-500'/>
            </div>
        );
    }
    return(

        <div
            className='flex flex-col h-full bg-slack-medium'
        >
            <WorkspacePanelHeaders workspace={workspaceDetails} />

            <div className='flex flex-col px-2 mt-3' >
                <SideBarItem
                    label='Threads'
                    variant='active'
                    id='Thread'
                    Icon={MessageSquareTextIcon}
                />
                <SideBarItem
                    label='Drafts and Sends'
                    variant='default'
                    id='Thread'
                    Icon={SendHorizonalIcon}
                />
                <WorkspacePanelSection 
                    label='Channels'
                    onIconClick={()=> setOpenCreateChannelModal(true)}
                >
                    {workspaceDetails?.channels?.map((channel) => {
                        return (
                            <SideBarItem
                                key={channel._id}
                                label={channel.name}
                                id={channel._id}
                                Icon={HashIcon}
                            />
                        );
                    })}
                </WorkspacePanelSection>
            </div>

        </div>
    );
};