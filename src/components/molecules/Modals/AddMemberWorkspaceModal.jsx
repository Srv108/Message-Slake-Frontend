import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddMemberToWorkspace } from '@/hooks/api/workspace/useAddMemberToWorkspace';
import { useAddMemberContext } from '@/hooks/context/useAddMemberContext';

export const AddMemberWorkspaceModal = () => {

    const queryClient = useQueryClient();

    const [ memberDetails, setMemberDetails ] = useState({
        userId: '',
        role: ''
    });

    const { openAddMemberModal, setOpenAddMemberModal } = useAddMemberContext();

    const { isPending, addMemberToWorkspaceMutation } = useAddMemberToWorkspace();
    async function handleFormSubmit(e) {
        e.preventDefault();
        try {

            await addMemberToWorkspaceMutation ({
                userId: memberDetails?.userId,
                role: memberDetails?.role || 'member'
            });

            queryClient.invalidateQueries(`FetchMembers-${memberDetails.userId}`);
        } catch (error) {
            console.log('Error coming in add member in modal',error);
        } finally{
            setOpenAddMemberModal(false);
        }
    }
    return (
        <Dialog 
            open={openAddMemberModal}
            onOpenChange={() =>setOpenAddMemberModal(false)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> New Member </DialogTitle>
                </DialogHeader>
                <DialogDescription> Add your friends </DialogDescription>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="User Id" className="text-right">User ID: </Label>
                        <Input 
                            type='text'
                            required
                            id="User Id"
                            disabled={isPending}
                            className="col-span-3"
                            value={memberDetails.userId}
                            placeholder='Id of the member!'
                            onChange={(e) => setMemberDetails({
                                ...memberDetails,
                                userId: e.target.value
                            })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role: </Label>
                        <Input 
                            type='text'
                            id="role"
                            disabled={isPending}
                            className="col-span-3"
                            value={memberDetails.role}
                            placeholder='Description !'
                            onChange={(e) => setMemberDetails({
                                ...memberDetails,
                                role: e.target.value
                            })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type='button' disabled={isPending} onClick={handleFormSubmit}> Create Group</Button>
                    <DialogClose asChild>
                        <Button type="button" disabled={isPending} variant="secondary" onClick={() => setOpenAddMemberModal(false)}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};