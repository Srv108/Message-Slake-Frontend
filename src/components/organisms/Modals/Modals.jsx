import { AddMemberWorkspaceModal } from '@/components/molecules/Modals/AddMemberWorkspaceModal';
import { CreateChannelModel } from '@/components/molecules/Modals/CreateChannelModel';
import { DeleteConfirmationModal } from '@/components/molecules/Modals/DeleteConfirmationModal';
import { WorkspaceCreateModal } from '@/components/molecules/Modals/WorkspaceCreateModal';
import { WorkspacePreferenceModal } from '@/components/molecules/Modals/WorkspacePreferenceModal';

export const Modals = () => {
    return (
        <>
            <CreateChannelModel/>
            <WorkspaceCreateModal/>
            <AddMemberWorkspaceModal/>
            <DeleteConfirmationModal/>
            <WorkspacePreferenceModal/>
        </>
    );
};