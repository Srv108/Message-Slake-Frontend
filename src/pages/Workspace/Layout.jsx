import { WorkspacePanelNew } from '@/components/organisms/workspace/WorkspacePanelNew';
import { WorkspaceSidebar } from '@/components/organisms/workspace/WorkspaceSidebar';

import { HomeLayout } from '../Home/Layout';

export const WorkspaceLayout = ({ children }) => {

    return(
        <HomeLayout
            Sidebar={WorkspaceSidebar}
            Panel={WorkspacePanelNew}
        > { children }</HomeLayout>
    );
};