import { CreateChannelModel } from '@/components/molecules/Modals/CreateChannelModel';
import { WorkspaceCreateModal } from '@/components/molecules/Modals/WorkspaceCreateModal';
import { WorkspacePreferenceModal } from '@/components/molecules/Modals/WorkspacePreferenceModal';

export const Modals = () => {
    return (
        <>
            <CreateChannelModel/>
            <WorkspaceCreateModal/>
            <WorkspacePreferenceModal/>
        </>
    );
};