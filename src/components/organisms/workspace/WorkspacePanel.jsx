// import { useParams } from 'react-router-dom';

// import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
// import { useGetWorkspaceById } from '@/hooks/api/workspace/useGetWorkspaceById';

// export const WorkspacePanel = () => {

//     const { workspaceId } = useParams();
    
//     const { workspaceData } = useGetWorkspaceById(workspaceId);

//     return(
//         <ResizablePanelGroup
//             direction="vertical"
//         >
//             <ResizablePanel>

//             </ResizablePanel>

//             <ResizableHandle/>

//             <ResizablePanel>
//                 Workspace
//             </ResizablePanel>
//         </ResizablePanelGroup>
//     );
// };