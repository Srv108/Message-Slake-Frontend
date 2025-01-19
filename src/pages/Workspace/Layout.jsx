import { WorkspaceNavbar } from '@/components/organisms/workspace/WorkspaceNavbar';
import { WorkspacePanel } from '@/components/organisms/workspace/WorkspacePanel';
import { WorkspaceSidebar } from '@/components/organisms/workspace/WorkspaceSidebar';

import { HomeLayout } from '../Home/Layout';

export const WorkspaceLayout = ({ children }) => {

    return(
        <HomeLayout
            Navbar={WorkspaceNavbar}
            Sidebar={WorkspaceSidebar}
            Panel={WorkspacePanel}
        > { children }</HomeLayout>
    );
};