import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateChannelContext } from '@/hooks/context/useCreateChannelContext';

export const CreateChannelModel = () => {
    
    const { openCreateChannelModal, setOpenCreateChannelModal } = useCreateChannelContext();

    function handleFormSubmit(e) {
        e.preventDefault();
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
                        <Label htmlFor="name" className="text-right">Name: </Label>
                        <Input 
                            type='text'
                            required
                            id="name"
                            minLength={3}
                            className="col-span-3"
                            placeholder='Name of the Channel!'
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description: </Label>
                        <Input 
                            type='text'
                            id="description"
                            className="col-span-3"
                        />
                    </div>
                    </div>
                    <DialogFooter>
                        <Button type='button' onClick={handleFormSubmit}> Create Channel</Button>
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