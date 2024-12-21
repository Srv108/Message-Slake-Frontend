import { DeleteIcon } from 'lucide-react';

import { ConfirmationModal } from '@/components/atoms/ConfirmationModal/ConfirmationModal';
import { useWorkspacePreferenceModal } from '@/hooks/context/useWorkspacePreferenceModal';

export const DeleteConfirmationModal = ( ) => {
    const { setOpenWorkspacePreference } = useWorkspacePreferenceModal();
    return (
        <ConfirmationModal
            title='Confirm Deletion'
            description='Are you sure want to delete'
            IconVariant='destructive'
            Icon={DeleteIcon}
            onIconClick={() => setOpenWorkspacePreference(false)}
        />
    );
};