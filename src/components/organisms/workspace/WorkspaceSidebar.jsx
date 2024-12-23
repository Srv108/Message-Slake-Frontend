import  { HeartIcon, HomeIcon, MessageSquareIcon, MoreHorizontalIcon, SearchIcon, UserIcon } from 'lucide-react';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { SidebarButton } from '@/components/molecules/SidebarButton/SidebarButton';
import { useProfileModal } from '@/hooks/context/useProfileModal';

import { WorkspaceSwitcher } from './WorkspaceSwitcher';

export const WorkspaceSidebar = () => {

    const { setOpenProfileModal } = useProfileModal();

    return (
        <aside
            className="w-[70px] h-full bg-slack-dark flex flex-col gap-y-4 items-center pt-[10px] pb-[5px]"
        >
            <WorkspaceSwitcher />

            <SidebarButton 
                Icon={HomeIcon}
                label="Home"
            />

            <SidebarButton 
                Icon={SearchIcon}
                label='Search'
            />

            <SidebarButton
                Icon={HeartIcon}
                label="Notification"
            />
            
            <SidebarButton
                Icon={MessageSquareIcon}
                label="DMs"
            />

            <SidebarButton
                Icon={MoreHorizontalIcon}
                label="More"
            />
            <SidebarButton 
                Icon={UserIcon}
                label='Profile'
                iconOnClick={() => setOpenProfileModal(true)}
            />
            <div className='flex flex-col items-center justify-center mt-auto mb-5 gap-y-1'>
                <UserButton />
            </div>
            
        </aside>
    );
};