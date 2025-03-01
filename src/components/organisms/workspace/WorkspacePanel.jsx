import { useQueryClient } from '@tanstack/react-query';
import { HashIcon, Loader, MessageSquareTextIcon, SendHorizonalIcon, TriangleAlertIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { SideBarItem } from '@/components/atoms/SideBarItem/SideBarItem';
import { UserItem } from '@/components/atoms/UserItem/UserItem';
import { WorkspacePanelHeaders } from '@/components/molecules/Workspace/WorkspacePanelHeaders';
import { WorkspacePanelMemberSection } from '@/components/molecules/Workspace/WorkspacePanelMemberSection';
import { WorkspacePanelSection } from '@/components/molecules/Workspace/WorkspacePanelSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAddMemberToWorkspaceByUsername } from '@/hooks/api/workspace/useAddMemberToWorkspaceByUsername';
import { useGetWorkspaceById } from '@/hooks/api/workspace/useGetWorkspaceById';
import { useAddMemberContext } from '@/hooks/context/useAddMemberContext';
import { useCreateChannelContext } from '@/hooks/context/useCreateChannelContext';

export const WorkspacePanel = () => {

    const queryClient = useQueryClient();
    const { workspaceId } = useParams();
    const { setOpenCreateChannelModal } = useCreateChannelContext();
    const { setOpenAddMemberModal } = useAddMemberContext();

    const { isFetching, isSuccess, workspaceDetails } = useGetWorkspaceById(workspaceId);

    const { setFormSubmitHandler, setIsPending } = useAddMemberContext();
    const { isPending, addMemberToWorkspaceByUsernameMutation} = useAddMemberToWorkspaceByUsername();

    async function formHandlerFunction(username){
        try {
            console.log('add member to workspace handler initiates....');
            const response = await addMemberToWorkspaceByUsernameMutation (username);
            queryClient.invalidateQueries(`FetchMembers-${response._id}`);
        } catch (error) {
            console.log('error coming add member to workspace modal',error);
        }
    }

    useEffect(() => {
        setIsPending(isPending);
    },[isPending,setIsPending]);

    function handleAddMemberIconClick(){
        setOpenAddMemberModal(true);
        setFormSubmitHandler(() => formHandlerFunction);
    }

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
            <ScrollArea  >
                <div className='flex flex-col px-2 mt-3 mb-3' >
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
                                    type='channel'
                                    label={channel.name}
                                    id={channel._id}
                                    Icon={HashIcon}
                                />
                            );
                        })}
                    </WorkspacePanelSection>

                    <WorkspacePanelMemberSection 
                        label='Members'
                        onIconClick={handleAddMemberIconClick}
                    >
                        {workspaceDetails?.members?.map((member) => {
                            return (
                                <UserItem
                                    key={member.memberId._id}
                                    id={member.memberId._id}
                                    type='workspace'
                                    label={member.memberId.username}
                                    image={member.memberId.avatar}
                                />
                            );
                        })}
                    </WorkspacePanelMemberSection>
                </div>
            </ScrollArea>
        </div>

    );
};