import { ChevronDownIcon, ListFilterIcon, SquarePenIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/context/useAuth';
import { useWorkspacePreferenceModal } from '@/hooks/context/useWorkspacePreferenceModal';

export const WorkspacePanelHeaders = ({ workspace }) => {


    const { auth } = useAuth();
    const { setOpenWorkspacePreference } = useWorkspacePreferenceModal();
    const isLoggedInUserAdmin = workspace?.members?.find((member) => member.memberId === auth?.user?.id && member.role === 'admin');

    console.log('Current user is ' ,isLoggedInUserAdmin);
    return (
        <div className='flex items-center justify-between px-4 h-[50px] gap-0.5'>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button
                        variant='transparent'
                        className='font-semibold text-lg w-auto  p-1.5 overflow-hidden'
                    >
                        <span className='min-w-[100px] font-serif'>
                            {workspace?.name} Workspace
                        </span>
                        <ChevronDownIcon className=""/>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <div
                            className='size-9 relative overflow-hidden text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2 bg-[#616061]'
                        >
                            {workspace?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className='flex flex-col'>
                            <p className='font-bold'>
                                {workspace?.name}
                            </p>
                            <p className='text-xs text-green-500'>
                                Active
                            </p>
                        </div>
                    </DropdownMenuItem>

                    {
                        isLoggedInUserAdmin && (
                            <>
                                <DropdownMenuItem
                                    className='cursor-pointer py-2'
                                    onClick={() => {
                                        setTimeout(() => {
                                            setOpenWorkspacePreference(true);
                                        },10);
                                    }}
                                >
                                    Preferences
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className='cursor-pointer py-2'
                                >
                                    Invite people to {workspace?.name}
                                </DropdownMenuItem>
                            </>
                        )
                    }
                </DropdownMenuContent>
            </DropdownMenu>

            <div className='flex items-center gap-1'>
                    <Button
                        variant='transparent'
                        size='iconSm'
                    >
                        <ListFilterIcon className='size-5'/>
                    </Button>

                    <Button
                        variant='transparent'
                        size='iconSm'
                    >
                        <SquarePenIcon className='size-5' />
                    </Button>
            </div>
        </div>

    );
};