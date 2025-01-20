import { cva } from 'class-variance-authority';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/hooks/context/useWorkspace';
import { cn } from '@/lib/utils';

const userItemVariants = cva(
    'flex items-center gap-3 justify-start font-normal h-14 px-4 mt-2 text-sm border border-slack-dark rounded-md transition-colors duration-200',
    {
        variants: {
            variant: {
                default: 'text-[#f9edffcc] hover:bg-[#f9edff33]',
                active: 'text-[#481350] bg-white/90 hover:bg-white/80'
            }
        },
        defaultVariants: 'default'
    }
);

export const UserItem = ({
    id,
    type,
    label = 'Member',
    image,
    variant
}) => {

    const { currentWorkspace } = useWorkspace();

    return (
        <Button
            className={cn(userItemVariants({ variant }))}
            variant="transparent"
            size="sm"
            asChild
        >
            <div className="w-full p-1 flex flex-row justify-between items-center">
                <Link to={(type === 'workspace') ? `/workspace/${currentWorkspace?._id}/members/${id}` : `/directMessages/member/${id}`}  className="flex items-center space-x-5 w-4/5">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={image} className="rounded-full w-full h-full object-cover" />
                        <AvatarFallback className="rounded-full bg-slate-600 text-white text-xl font-bold">
                            {label.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 w-full">
                        <p className="text-sm text-white truncate">{label}</p>
                        <p className="text-xs text-slate-500 truncate">Hey, are you available?</p>
                    </div>
                </Link>
                

                <div className="text-xs text-gray-400 w-1/5 flex items-center justify-end space-x-2">
                    <div className='flex flex-col justify-center items-end space-y-1'>
                        <span>3 hours ago</span>
                        <div
                            size='iconSm'
                            onClick={() => console.log('icon is clicked')}
                            className='cursor-pointer transition-transform duration-200 hover:scale-150'
                        >
                            <FaChevronDown  className="size-5 cursor-pointer" />
                        </div>    
                    </div>   
                </div>
            </div>
        </Button>
    );
};