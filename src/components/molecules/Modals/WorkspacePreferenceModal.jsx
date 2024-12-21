import { useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeleteWorkspace } from '@/hooks/api/workspace/useDeleteWorkspace';
// import { useUpdateWorkspace } from '@/hooks/api/workspace/useUpdateWorkspace';
import { useWorkspace } from '@/hooks/context/useWorkspace';
import { useWorkspacePreferenceModal } from '@/hooks/context/useWorkspacePreferenceModal';

export const WorkspacePreferenceModal = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { openWorkspacePreference, setOpenWorkspacePreference, initialValue } = useWorkspacePreferenceModal();

    // const [editName, setEditName] = useState();
    const [isEditing,setIsEditing] = useState(false);
    const { currentWorkspace } = useWorkspace();
    const { deleteWorkspaceMutation, isPending } = useDeleteWorkspace(currentWorkspace?._id);
    // const { updateWorkspaceMutataion } = useUpdateWorkspace();
    
    async function handleDeleteWorkspace() {
        try {
            await deleteWorkspaceMutation();
            queryClient.invalidateQueries('fetchworkspaces');
            navigate('/home');
            setOpenWorkspacePreference(false);
        } catch (error) {
            console.log('Error coming in workspace prefence modal in deleting workspace',error);
        } 
    }


    return(
        <>
            <Dialog
                open={openWorkspacePreference}
                onOpenChange={() => setOpenWorkspacePreference(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{initialValue}</DialogTitle>
                    </DialogHeader>
                    <div className='px-4 pb-4 flex flex-col gap-y-2'>
                        <div
                            className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'
                        >   
                            <div className='flex items-center justify-between'>
                                <p  
                                    contentEditable={isEditing}
                                    className='font-semibold text-sm'
                                >
                                    {currentWorkspace?.name} workspace
                                </p>
                                <p  
                                    onClick={() => setIsEditing(true)}
                                    className='text-sm font-semibold hover:underline'
                                >
                                    Edit
                                </p>
                            </div>
                        </div>
                        <button
                            disabled={isPending}
                            onClick={handleDeleteWorkspace}
                            className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'
                        >
                            <TrashIcon className='size-5' />
                            <p className='text-sm' >
                                Delete Workspace
                            </p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};