import { useQueryClient } from '@tanstack/react-query';
import { CopyIcon, RefreshCcwIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUpdateWorkspaceJoincode } from '@/hooks/api/workspace/useupdateWorkspaceJoincode';
import { useToast } from '@/hooks/use-toast';

export const WorkspaceInviteModal = ({
    joinCode,
    workspaceId,
    workspaceName,
    openInviteModal,
    setOpenInviteModal
}) => {

    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { updateWorkspaceJoinCodeMutation } = useUpdateWorkspaceJoincode(workspaceId);

    async function handleCopy(){
        const invuteLink = `${window.location.origin}/${workspaceName}/join/${joinCode}`;
        await navigator.clipboard.writeText(invuteLink);

        toast({
            variant: 'success',
            title: 'Link Copied'
        });
    }

    async function handleResetCode() {
        try{
            await updateWorkspaceJoinCodeMutation();

            queryClient.invalidateQueries(`fetchWorkspace-${workspaceId}`);
        } catch(error){
            console.log('failed to reset the join code',error);
        }
    }
    return (
        <Dialog
            open={openInviteModal}
            onOpenChange={() => setOpenInviteModal(false)}
        >
            <DialogContent className='bg-slack-medium w-2/5 h-1/2 overflow-hidden'>
                <DialogHeader className='flex flex-col justify-center items-center'>
                    <DialogTitle className='text-slate-500 font-serif text-lg'> Invite People To {workspaceName} </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col justify-center items-center py-5 gap-y-4">
                    <p className="font-serif bg-slack-dark rounded-lg p-1 text-white text-4xl uppercase">
                        {joinCode}
                    </p>
                    <Button
                        variant='outline'
                        onClick={handleCopy}
                        className='font-semibold'
                    >
                        Copy Link
                        <CopyIcon className="size-5 ml-3" />
                    </Button>
                </div>
                <div
                    className='flex items-center justify-center w-full mb-5'
                >
                    <Button 
                        variant="outline" 
                        onClick={handleResetCode}
                        className='font-semibold'
                    >
                        Reset Join Code
                        <RefreshCcwIcon className='size-4 ml-2' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};