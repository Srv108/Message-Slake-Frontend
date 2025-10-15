import { useCallback,useState } from 'react';

import { useTheme } from '@/contexts/ThemeContext';

import { useAddMemberContext } from './context/useAddMemberContext';
import { useWorkspaceCreateModal } from './context/useWorkspaceCreateModal';

export const useFloatingActions = () => {
    const { theme, toggleTheme } = useTheme();
    const { setOpen: setOpenAddMember } = useAddMemberContext();
    const { setOpenWorkspaceCreateModal } = useWorkspaceCreateModal();
    const [isHovered, setIsHovered] = useState(null);

    const handleAddWorkspace = useCallback(() => {
        setOpenWorkspaceCreateModal(true);
    }, [setOpenWorkspaceCreateModal]);

    const handleAddMember = useCallback(() => {
        setOpenAddMember(true);
    }, [setOpenAddMember]);

    const handleMouseEnter = (action) => {
        setIsHovered(action);
    };

    const handleMouseLeave = () => {
        setIsHovered(null);
    };

    return {
        theme,
        toggleTheme,
        isHovered,
        handleAddWorkspace,
        handleAddMember,
        handleMouseEnter,
        handleMouseLeave,
    };
};
