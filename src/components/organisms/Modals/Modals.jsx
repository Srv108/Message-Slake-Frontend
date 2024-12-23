import { AcceptFormDataModal } from '@/components/molecules/Modals/AcceptFormDataModal';
import { AddMemberWorkspaceModal } from '@/components/molecules/Modals/AddMemberWorkspaceModal';
import { CreateChannelModel } from '@/components/molecules/Modals/CreateChannelModel';
import { UserProfileModal } from '@/components/molecules/Modals/UserProfileModal';
import { WorkspaceCreateModal } from '@/components/molecules/Modals/WorkspaceCreateModal';
import { WorkspacePreferenceModal } from '@/components/molecules/Modals/WorkspacePreferenceModal';

export const Modals = () => {
    return (
        <>
            <UserProfileModal />
            <CreateChannelModel/>
            <WorkspaceCreateModal/>
            <AcceptFormDataModal />
            <AddMemberWorkspaceModal/>
            <WorkspacePreferenceModal/>
        </>
    );
};