import { WorkspaceNavbar } from '@/components/organisms/workspace/WorkspaceNavbar';
import { WorkspaceSidebar } from '@/components/organisms/workspace/WorkspaceSidebar';

export const WorkspaceLayout = ({ children }) => {

    return(
        <div className="h-[100vh]">
            <WorkspaceNavbar />
            <div className="flex h-[calc(100vh-40px)]">
                <WorkspaceSidebar />
                {children}
            </div>
        </div>
    );
};