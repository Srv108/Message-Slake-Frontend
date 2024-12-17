import { WorkspaceSidebar } from '@/components/organisms/workspace/WorkspaceSidebar';

export const WorkspaceLayout = ({ children }) => {

    return(
        <div className="h-[100vh] flex flex-row">
            <div className="h-full">
                <WorkspaceSidebar />
            </div>
            {children}
        </div>
    );
};