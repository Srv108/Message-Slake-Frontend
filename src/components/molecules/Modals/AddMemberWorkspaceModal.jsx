import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddMemberContext } from '@/hooks/context/useAddMemberContext';

export const AddMemberWorkspaceModal = () => {


    const [ username, setUsername ] = useState('');

    const { openAddMemberModal, setOpenAddMemberModal, formSubmitHandler, isPending } = useAddMemberContext();

    async function handleFormSubmit(e) {
        e.preventDefault();
        if (!formSubmitHandler) {
            console.error('Form submit handler is not set.');
            return;
        }

        try {
            await formSubmitHandler (username);
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
            <DialogContent className='bg-slack-medium'>
                <DialogHeader>
                    <DialogTitle> New Member </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="User Id" className="text-right text-slate-300 text-lg font-serif" > To : </Label>
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