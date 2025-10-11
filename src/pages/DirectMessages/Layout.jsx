import { DirectMessagePanel } from '@/components/organisms/Dms/DirectMessagePanel';
import { SideBar } from '@/components/organisms/SideBar/SideBar';

import { HomeLayout } from '../Home/Layout';

export const DirectMessageLayout = ({ children }) => {

    return (
        <HomeLayout
            Sidebar={SideBar}
            Panel={DirectMessagePanel}
        >
            { children }
        </HomeLayout>
    );
};