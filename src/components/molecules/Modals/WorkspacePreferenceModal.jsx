import { useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConfirmationModal } from '@/components/atoms/ConfirmationModal/ConfirmationModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDeleteWorkspace } from '@/hooks/api/workspace/useDeleteWorkspace';
import { useUpdateWorkspace } from '@/hooks/api/workspace/useUpdateWorkspace';
import { useWorkspace } from '@/hooks/context/useWorkspace';
import { useWorkspacePreferenceModal } from '@/hooks/context/useWorkspacePreferenceModal';
import { useToast } from '@/hooks/use-toast';
import { useConfirm } from '@/hooks/useConfirm';

export const WorkspacePreferenceModal = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();  

    const { openWorkspacePreference, setOpenWorkspacePreference, initialValue } = useWorkspacePreferenceModal();
    const { currentWorkspace } = useWorkspace();
    const { deleteWorkspaceMutation, isPending: deletePending } = useDeleteWorkspace(currentWorkspace?._id);
    const { isPending: updatePending, updateWorkspaceMutataion } = useUpdateWorkspace(currentWorkspace?._id);

    
    const [editOpen, setEditOpen] = useState(false);
    const [renameValue, setRenameValue] = useState(currentWorkspace?.name);

    const { promise, handleClose, handleConfirm, confirmation } = useConfirm();

    async function handleDeleteWorkspace() {
        try {
            const ok = await confirmation();
            console.log('Confirmation recieved');
            if(!ok) return;
            await deleteWorkspaceMutation();
            queryClient.invalidateQueries('fetchworkspaces');
            navigate('/home');
            setOpenWorkspacePreference(false); 
            toast({
                variant: 'success',
                title: 'Workspace deleted successfully',
            });
        } catch (error) {
            console.log('Error deleting workspace', error);
            toast({
                variant: 'destructive',
                title: 'Error deleting workspace',
            });
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault(); 
        try {
            console.log(renameValue);
            await updateWorkspaceMutataion({
                name: renameValue,
            });
            queryClient.invalidateQueries(`fetchWorkspace-${currentWorkspace?._id}`);
            setOpenWorkspacePreference(false);
            toast({
                title: 'Workspace updated successfully',
                type: 'success',
            });
        } catch (error) {
            console.log('Error updating workspace', error);
            toast({
                title: 'Error updating workspace',
                type: 'error',
            });
        }
    }

    return (
        <>
            <ConfirmationModal 
                title='Confirm Deletion'
                message='Are you sure want to delete'
                promise={promise}
                handleClose={handleClose}
                handleConfirm={handleConfirm}
            />
            <Dialog open={openWorkspacePreference} onOpenChange={() => setOpenWorkspacePreference(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{initialValue}</DialogTitle>
                    </DialogHeader>

                    <div className='px-4 pb-4 flex flex-col gap-y-2'>
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger>
                                <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>
                                    <div className='flex items-center justify-between'>
                                        <p className='font-semibold text-sm'>
                                            {currentWorkspace?.name} workspace
                                        </p>
                                        <p
                                            onClick={() => setEditOpen(true)}
                                            className='text-sm font-semibold hover:underline'
                                        >
                                            Edit
                                        </p>
                                    </div>
                                </div>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>Rename Workspace</DialogHeader>
                                <form className='space-y-4' onSubmit={handleFormSubmit}>
                                    <Input
                                        value={renameValue}
                                        onChange={(e) => setRenameValue(e.target.value)}
                                        required
                                        autoFocus
                                        minLength={3}
                                        maxLength={50}
                                        disabled={updatePending}
                                        placeholder='Workspace Name e.g. Design Team'
                                    />
                                    <DialogFooter>
                                        <DialogClose>
                                            <Button variant='outline' disabled={updatePending}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button type='submit' disabled={updatePending}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <button
                            onClick={handleDeleteWorkspace}
                            disabled={deletePending}
                            className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'
                        >
                            <TrashIcon className='size-5' />
                            <p className='text-sm font-semibold'>Delete Workspace</p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
