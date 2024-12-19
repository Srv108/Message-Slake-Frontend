import { TrashIcon } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWorkspacePreferenceModal } from '@/hooks/context/useWorkspacePreferenceModal';

export const WorkspacePreferenceModal = () => {

    const { openWorkspacePreference, setOpenWorkspacePreference, initialValue } = useWorkspacePreferenceModal();

    return(
        <>
            <Dialog
                open={openWorkspacePreference}
                onOpenChange={() => setOpenWorkspacePreference(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{initialValue}</DialogTitle>
                    </DialogHeader>
                    <div className='px-4 pb-4 flex flex-col gap-y-2'>
                        <div
                            className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'
                        >   
                            <div className='flex items-center justify-between'>
                                <p
                                    className='font-semibold text-sm'
                                >
                                    Workspace Name
                                </p>
                                <p
                                    className='text-sm font-semibold hover:underline'
                                >
                                    Edit
                                </p>
                            </div>
                        </div>
                        <button
                            className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'
                        >
                            <TrashIcon className='size-5' />
                            <p>
                                Delete Workspace
                            </p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};