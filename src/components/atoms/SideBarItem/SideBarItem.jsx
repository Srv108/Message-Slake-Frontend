import { cva } from 'class-variance-authority';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sideBarItemVariants = cva(
    'flex items-center justify-start gap-2 my-1 font-normal h-8 px-[20px] text-sm overflow-hidden',
    {
        variants: {
            variant: {
                default: 'text-[#f9edffcc]',
                active: 'text-[#481350] bg-white/90 hover:bg-white/80'
            }
        },
        defaultVariants: 'default'
    }
);

export const SideBarItem = ({
    id,
    Icon,
    type,
    label,
    variant
}) => {
    const { workspaceId } = useParams();
    return (
        <Button
            variant="transparent"
            size="sm"
            className={cn(sideBarItemVariants({variant}))}
        >
            <Link
                className='flex items-center gap-2'
                to={(type === 'channel') ? `/workspace/${workspaceId}/channels/${id}` : `/workspace/${workspaceId}/members/${id}`}
            >
                <Icon className='size-3.5 mr-1' />
                <span className='text-sm'>
                    {label}
                </span>
            </Link>
        </Button>
    );
};