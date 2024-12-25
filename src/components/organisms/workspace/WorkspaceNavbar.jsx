import { InfoIcon, Loader, SearchIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useGetWorkspaceById } from '@/hooks/api/workspace/useGetWorkspaceById';
import { useAuth } from '@/hooks/context/useAuth';
import { useWorkspace } from '@/hooks/context/useWorkspace';

export const WorkspaceNavbar = () => {

    const navigate = useNavigate();
    const { logout } = useAuth();
    const { workspaceId } = useParams();
    
    const { setCurrentWorkspace } = useWorkspace();
    const { isFetching, workspaceDetails ,error, isSuccess } = useGetWorkspaceById(workspaceId);

    useEffect(()=>{
        if(!isFetching && !isSuccess && error){
            if(error.status === 403){
                logout();
                navigate('/auth/signin');
            }
        }
        if(workspaceDetails){
            setCurrentWorkspace(workspaceDetails);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[workspaceDetails,setCurrentWorkspace, error, isSuccess ,isFetching ]);
    
    if(isFetching){
        return (<Loader className='animate-spin ml-2' />);
    }

    return (
        <nav
            className='flex items-center justify-center h-10 p-1.5 bg-slack-dark'
        >
            <div className='flex-1' />
            <div>
                <Button
                    size='sm'
                    className='bg-accent/25 hover:bg-accent/15 w-full justify-start h-7 px-2'
                >
                    <SearchIcon className='size-5 text-white mr-2' />
                    <span className='text-white text-xs'>
                        Search {workspaceDetails?.name || 'Workspace'} 
                    </span>
                </Button>
            </div>

            <div
                className='ml-auto flex-1 flex items-center justify-end'
            >
                <Button
                    variant='transparent'
                    size='iconSm'
                >
                    <InfoIcon className='size-5 text-white' />
                </Button>
            </div>
        </nav>
    );
};