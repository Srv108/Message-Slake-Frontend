import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateChannel } from '@/hooks/api/channel/useCreateChannel';
import { useCreateChannelContext } from '@/hooks/context/useCreateChannelContext';
import { useWorkspace } from '@/hooks/context/useWorkspace';
import { useToast } from '@/hooks/use-toast';

export const CreateChannelModel = () => {

    const { toast} = useToast();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const { currentWorkspace } = useWorkspace();
    const { openCreateChannelModal, setOpenCreateChannelModal } = useCreateChannelContext();
    const { isPending, createChannelMutation } = useCreateChannel();

    async function handleFormSubmit(e) {
        e.preventDefault();

        try {
            await createChannelMutation({
                name: name,
                workspaceId: currentWorkspace?._id
            });
            toast({
                variant: 'success',
                title: `${name} channel created Successfully`,
            });
            queryClient.invalidateQueries(`fetchWorkspace-${currentWorkspace._id}`);
            
        } catch (error) {
            console.log('Failed to create workspace',error);
        } finally{
            setName(name);
            setOpenCreateChannelModal(false);
        }
        
    }

    function handleClose() {
        setOpenCreateChannelModal(false);
    }
    return (

        <Dialog
            open={openCreateChannelModal}
            onOpenChange={handleClose}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> New Channel </DialogTitle>
                    <DialogDescription> create channel to chat with your friends </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right font-semibold">Name: </Label>
                        <Input 
                            type='text'
                            required
                            id="name"
                            minLength={3}
                            disabled={isPending}
                            className="col-span-3"
                            placeholder='Name of the Channel!'
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type='button' disabled={isPending} onClick={handleFormSubmit}> Create Channel</Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};