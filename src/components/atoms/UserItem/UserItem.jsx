import { cva } from 'class-variance-authority';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/hooks/context/useWorkspace';
import { cn } from '@/lib/utils';

const userItemvariants = cva(
    'flex items-center gap-1.5 justify-start font-normal h-7 px-4 mt-2 text-sm',
    {
        variants: {
            variant: {
                default: 'text-[#f9edffcc]',
                active: 'text-[#481350] bg-white/90 hover:bg-white/80'
            },
            defaultVariants: 'default'
        }
    }
);
export const UserItem = ({
    id,
    label='Member',
    image,
    variant
}) => {

    const { currentWorkspace } = useWorkspace();

    return (
        <Button
            className={cn(userItemvariants({variant}))}
        >
            <Link to={`/workspace/${currentWorkspace._id}/members/${id} `} >
                <Avatar >
                    <AvatarImage src={image} className='rounded-md' />
                    <AvatarFallback 
                        className='rounded-md bg-sky-500 text-white'
                    >
                        {label.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">
                    {label}
                </span>
            </Link>
        </Button>
    );
};