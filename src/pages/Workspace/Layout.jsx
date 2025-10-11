import { WorkspaceNavbar } from '@/components/organisms/workspace/WorkspaceNavbar';
import { WorkspacePanelNew } from '@/components/organisms/workspace/WorkspacePanelNew';
import { WorkspaceSidebar } from '@/components/organisms/workspace/WorkspaceSidebar';

import { HomeLayout } from '../Home/Layout';

export const WorkspaceLayout = ({ children }) => {

    return(
        <HomeLayout
            Navbar={WorkspaceNavbar}
            Sidebar={WorkspaceSidebar}
            Panel={WorkspacePanelNew}
        > { children }</HomeLayout>
    );
};