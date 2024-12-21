import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { useConfirmContext } from '@/hooks/context/useConfirmContext';

export const ConfirmationModal = ({ title, description, Icon, IconVariant, onIconClick }) => {

    const { openConfirmModal, setOpenConfirmModal, setConfirmation } = useConfirmContext();
    function handleConfirmation () {
        setConfirmation(true);
        setOpenConfirmModal(false);
        onIconClick();
    }
    return (
        <Dialog
            open={openConfirmModal}
            onOpenChange={() => setOpenConfirmModal(false)}
        >
            <DialogContent className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <DialogHeader className="text-xl font-semibold text-gray-900">{title}</DialogHeader>
                <DialogDescription className="mt-2 text-sm text-gray-600">{description}</DialogDescription>

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
                        variant={IconVariant}
                        onClick={handleConfirmation}
                        className="flex items-center px-4 py-2 text-white rounded-md transition"
                    >
                        <Icon className="w-10 h-5 mr-2" />
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
