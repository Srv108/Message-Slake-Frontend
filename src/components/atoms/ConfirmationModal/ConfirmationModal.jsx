import { DeleteIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';

export const ConfirmationModal = ({
    title, 
    message, 
    promise,
    handleClose,
    handleConfirm
}) => {

    console.log('modal opened');
    return (
        <Dialog
            open={promise !== null}
            onOpenChange={handleClose}
        >
            <DialogContent className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <DialogHeader className="text-xl font-semibold text-gray-900">{title}</DialogHeader>
                <DialogDescription className="mt-2 text-sm text-gray-600">{message}</DialogDescription>

                <DialogFooter className="flex justify-between space-x-4 mt-6">
                    <DialogClose>
                        <Button
                            variant="outline"
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
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
