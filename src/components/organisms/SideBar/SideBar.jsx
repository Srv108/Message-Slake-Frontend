import  { HeartIcon, HomeIcon, MessageSquareIcon, MoreHorizontalIcon, SearchIcon, UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { SidebarButton } from '@/components/molecules/SidebarButton/SidebarButton';
import { useProfileModal } from '@/hooks/context/useProfileModal';

export const SideBar = ({
    WorkspaceSwitcher
}) => {

    const navigate = useNavigate();
    const { setOpenProfileModal } = useProfileModal();

    return (
        <aside
            className="w-[70px] h-full bg-slack-dark flex flex-col gap-y-5 items-center pt-[10px] pb-[5px]"
        >
            {(WorkspaceSwitcher) && <WorkspaceSwitcher />}

            <SidebarButton 
                Icon={HomeIcon}
                label="Home"
                iconOnClick={() => {
                    navigate('/home');
                }}
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
                iconOnClick={() => {
                    navigate('/directMessages');
                }}
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