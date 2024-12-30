import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddMemberToWorkspaceByUsername } from '@/hooks/api/workspace/useAddMemberToWorkspaceByUsername';
import { useAddMemberContext } from '@/hooks/context/useAddMemberContext';

export const AddMemberWorkspaceModal = () => {

    const queryClient = useQueryClient();

    const [ username, setUsername ] = useState('');

    const { openAddMemberModal, setOpenAddMemberModal } = useAddMemberContext();

    const { isPending, addMemberToWorkspaceByUsernameMutation} = useAddMemberToWorkspaceByUsername();
    async function handleFormSubmit(e) {
        e.preventDefault();
        try {

            const response = await addMemberToWorkspaceByUsernameMutation (username);

            queryClient.invalidateQueries(`FetchMembers-${response._id}`);
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
                        <Label htmlFor="User Id" className="text-right">Username: </Label>
                        <Input 
                            type='text'
                            required
                            id="User Id"
                            disabled={isPending}
                            className="col-span-3"
                            value={username}
                            placeholder='username of the member!'
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    
                </div>
                <DialogFooter>
                    <Button type='button' disabled={isPending} onClick={handleFormSubmit}> Add Member </Button>
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