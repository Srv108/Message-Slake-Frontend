import { DeleteIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';


export const useConfirm = ({
    title,
    message
}) => {

    const [promise,setPromise] = useState(null);

    async function confirmation() {
        console.log('confirmation fun hits');
        return new Promise((resolve) => {
            setPromise({resolve});
        });
    }

    const  handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };
    const ConfirmDialog = () => {
        return (
            <Dialog
                open={promise !== null}
                onOpenChange={handleClose}
            >
                <DialogContent className="w-full max-w-md p-6 bg-slack-medium rounded-lg shadow-lg">
                    <DialogHeader className="text-xl font-semibold text-gray-900">{title}</DialogHeader>
                    <DialogDescription className="mt-2 text-sm text-teal-600">{message}</DialogDescription>

                    <DialogFooter className="flex justify-between space-x-4 mt-6">
                        <DialogClose>
                            <Button
                                variant='outline'
                                className="px-4 py-2 bg-blue-800 text-white border border-blue-900 hover:bg-blue-800 rounded-md transition"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            variant='destructive'
                            onClick={handleConfirm}
                            className="flex items-center px-4 py-2 text-white rounded-md transition"
                        >
                            <DeleteIcon className="w-10 h-5 mr-2" />
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };
    return { ConfirmDialog, confirmation};
};