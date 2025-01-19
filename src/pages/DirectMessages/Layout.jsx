import { DirectMessageNavbar } from '@/components/organisms/Dms/DirectMessageNavbar';
import { DirectMessagePanel } from '@/components/organisms/Dms/DirectMessagePanel';
import { SideBar } from '@/components/organisms/SideBar/SideBar';

import { HomeLayout } from '../Home/Layout';

export const DirectMessageLayout = ({ children }) => {

    return (
        <HomeLayout
            Navbar={DirectMessageNavbar}
            Sidebar={SideBar}
            Panel={DirectMessagePanel}
        >
            { children }
        </HomeLayout>
    );
};