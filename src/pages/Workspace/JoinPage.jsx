import { MessageSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import VerificationInput from 'react-verification-input';

import { Button } from '@/components/ui/button';
import { useJoinWorkspace } from '@/hooks/api/workspace/useJoinWorkspace';

export const JoinPage = () => {

    const navigate = useNavigate();
    const { workspaceId } = useParams();
    const { isPending, joinWorkspaceMutation } = useJoinWorkspace(workspaceId);

    async function handleAddMemberToWorkspace(joinCode) {
        try {
            console.log('now ready to join the workspce',joinCode);
            const response = await joinWorkspaceMutation(joinCode);

            if(response) navigate(`/workspace/${response._id}`);
        } catch (error) {
            console.log('Error coming from join workspace layout',error);
        }
    }

    function goBackToWorkspace(){
        if(window.opener){
            window.opener.history.back();
            window.close();
        }
    }
    return(
        <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center gap-y-8 p-4 sm:p-8">
            <div className="flex flex-col gap-y-6 items-center justify-center max-w-md w-full">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-black rounded-md flex items-center justify-center">
                        <MessageSquare className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-bold text-black tracking-tight">
                        MessageSlake
                    </span>
                </div>
                <div className='flex flex-col gap-y-3 items-center text-center'>
                    <h1 className="font-bold text-3xl sm:text-4xl text-black">
                        Join Workspace
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                        Enter the 6-digit code you received to join the workspace
                    </p>
                </div>

                <VerificationInput 
                    onComplete={handleAddMemberToWorkspace}
                    length={6}
                    classNames={{
                        container: 'flex gap-x-2',
                        character: 'h-auto rounded-md border-2 border-gray-300 flex items-center justify-center text-lg font-medium focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all',
                        characterInactive: 'bg-white',
                        characterFilled: 'bg-gray-100 text-black border-gray-400',
                        characterSelected: 'bg-white text-black border-black',
                    }}  
                    autoFocus
                />
            </div>
            <div className='flex gap-x-4'>
                <Button
                    size='lg'
                    variant='outline'
                    disabled={isPending}
                    onClick={goBackToWorkspace}
                    className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-all rounded-md"
                >
                    Back To Workspace
                </Button>
            </div>
        </div>
    );
};