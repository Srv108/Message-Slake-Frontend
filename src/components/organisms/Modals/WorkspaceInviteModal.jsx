import { useQueryClient } from '@tanstack/react-query';
import { CopyIcon, RefreshCcwIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUpdateWorkspaceJoincode } from '@/hooks/api/workspace/useUpdateWorkspaceJoincode';
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
        const inviteLink = `${window.location.origin}/workspace/join/${workspaceId}`;
        await navigator.clipboard.writeText(inviteLink);

        toast({
            variant: 'success',
            title: 'Link Link'
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
    async function handleCopyCode() {
        await navigator.clipboard.writeText(joinCode);
    }
    function openJoinPage(){
        window.open(`/workspace/join/${workspaceId}`,'_blank');
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
                    <div className='flex flex-row '>
                        <div className="flex flex-row font-bold bg-slack-dark rounded-lg p-1 text-white text-2xl uppercase">
                            {joinCode}
                            <CopyIcon onClick={handleCopyCode} className="size-6 ml-2 mt-1 cursor-pointer rounded " />
                        </div>
                    </div>
                    <Button
                        // variant='outline'
                        onClick={handleCopy}
                        className='font-semibold text-blue-500'
                    >
                        Copy Link
                        <CopyIcon className="size-5 ml-3" />
                    </Button>

                    <Button
                        onClick={openJoinPage}
                        className='text-blue-500'
                    >
                            Redirect to join page
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