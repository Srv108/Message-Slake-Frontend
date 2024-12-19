import { Loader, TriangleAlertIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { WorkspacePanelHeaders } from '@/components/molecules/Workspace/WorkspacePanelHeaders';
import { useGetWorkspaceById } from '@/hooks/api/workspace/useGetWorkspaceById';

export const WorkspacePanel = () => {

    const { workspaceId } = useParams();

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
        </div>
    );
};