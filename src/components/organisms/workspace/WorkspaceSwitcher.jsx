import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFetchWorkspaceOfMember } from '@/hooks/api/workspace/useFetchWorkspaceOfMember';
import { useGetWorkspaceById } from '@/hooks/api/workspace/useGetWorkspaceById';

export const WorkspaceSwitcher = () => {

    const { workspaceId } = useParams();
    const navigate = useNavigate();

    const { isFetching, workspaceData} = useGetWorkspaceById(workspaceId);

    const { isFetching: isLoading, Workspaces } = useFetchWorkspaceOfMember();

    useEffect(() => {
        if(Workspaces) console.log(Workspaces);
    },[Workspaces,isLoading]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    className='size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 font-semibold text-slate-800 text-xl'
                >
                    {isFetching ? (<Loader className='animate-spin' />) : workspaceData?.name.charAt(0).toUpperCase() }
                </Button>


            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    className='cursor-pointer justify-start items-start'
                >
                    {workspaceData?.name}
                    <span className='text-xs text-muted-foregorund text-green-500'>
                        (Active)
                    </span>
                </DropdownMenuItem>
                {isLoading ? ( <Loader className='size-5 animate-spin' /> ) :
                    Workspaces?.map((workspace) => {
                        if(workspace._id === workspaceId) return null;
                        return (
                            <DropdownMenuItem
                                className='cursor-pointer flex-col justify-start items-start'
                                onClick={() => navigate(`/workspace/${workspace._id}`)}
                                key={workspace._id}
                            >
                                <p className='truncate'> {workspace?.name} </p>
                            </DropdownMenuItem> 
                        );   
                    })
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
};