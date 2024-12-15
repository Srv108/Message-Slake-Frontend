import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateWorkspce } from '@/hooks/api/workspace/useCreateWorkspace';
import { useWorkspaceCreateModal } from '@/hooks/context/useWorkspaceCreateModal';


export const WorkspaceCreateModal = () => {

    const navigate = useNavigate();

    const [workspaceDetails,setWorkspaceDetails] = useState({
        name: '',
        description: ''
    });

    const { openWorkspaceCreateModal, setOpenWorkspaceCreateModal } = useWorkspaceCreateModal();
    const { isPending, createWorkspaceMutation } = useCreateWorkspce();

    async function handleFormSubmit(e){
        e.preventDefault();
        
        try {
            const response = await createWorkspaceMutation({
                name: workspaceDetails.name,
                description: workspaceDetails.description || ''
            });

            console.log('response coming from creating a new workspace ',response.data);
            navigate(`/workspace/${response.data._id}`);
        } catch (error) {
            console.log('error coming in creating workspace in modals', error);
        } finally {
            setWorkspaceDetails({
                name: workspaceDetails.name,
                description: workspaceDetails.description
            });
            setOpenWorkspaceCreateModal(false);
        }
    }

    function handleClose(){
        setOpenWorkspaceCreateModal(false);
    }
    return(
        <>
            <Dialog
                open={ openWorkspaceCreateModal }
                onOpenChange={handleClose}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>New Group</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Create a new group to chat with your friends
                    </DialogDescription>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name: </Label>
                        <Input 
                            type='text'
                            required
                            id="name"
                            minLength={3}
                            className="col-span-3"
                            disabled={isPending}
                            value={workspaceDetails.name}
                            placeholder='Name of the group!'
                            onChange={(e) => setWorkspaceDetails({
                                ...workspaceDetails,
                                name: e.target.value
                            })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description: </Label>
                        <Input 
                            type='text'
                            id="description"
                            className="col-span-3"
                            disabled={isPending}
                            value={workspaceDetails.description}
                            placeholder='Description !'
                            onChange={(e) => setWorkspaceDetails({
                                ...workspaceDetails,
                                description: e.target.value
                            })}
                            />
                    </div>
                    </div>
                    <DialogFooter>
                        <Button type='submit' disabled={isPending} onClick={handleFormSubmit}> Create Group</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    );
};