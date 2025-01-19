import { InfoIcon, SearchIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/context/useAuth';

export const DirectMessageNavbar = () => {

    const { auth } = useAuth();

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
                        Search {auth?.user?.username || 'DirectMessages'} 
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