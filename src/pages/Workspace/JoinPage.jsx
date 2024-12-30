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
        <div className="bg-slack-medium h-screen flex flex-col justify-center items-center gap-y-8 p-8 shadow-sm">
            <div className="flex flex-col gap-y-4 items-center justify-center">
                <div className='flex flex-col gap-y-2 items-center'>
                    <h1
                        className="font-bold text-3xl"
                    >
                        Join Workspace
                    </h1>
                    <p>
                        Enter the code you received to join the workspace
                    </p>
                </div>

                <VerificationInput 
                    onComplete={handleAddMemberToWorkspace}
                    length={6}
                    classNames={{
                        container: 'flex gap-x-2',
                        character: 'h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
                        characterInactive: 'bg-muted',
                        characterFilled: 'bg-white text-black',
                        characterSelected: 'bg-white text-black',
                    }}  
                    autoFocus
                />
            </div>
            <div
                className='flex gap-x-4'
            >
                <Button
                    size='lg'
                    variant='outline'
                    disabled={isPending}
                    onClick={goBackToWorkspace}
                >
                    Back To Workspace
                </Button>
            </div>
        </div>
    );
};