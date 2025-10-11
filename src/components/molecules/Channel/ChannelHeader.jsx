import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useChatTheme } from '@/hooks/context/useChatTheme';

export const ChannelHeader = ({ name, onOpenDetails }) => {
    const { getCurrentTheme } = useChatTheme();
    const currentTheme = getCurrentTheme();
    
    return (
        <div
            className={`border-b h-[60px] flex items-center px-5 ${currentTheme.messageBackground || 'bg-slack-medium'} transition-colors duration-300 shadow-sm`}
        >
            <Button
                variant="transparent"
                onClick={onOpenDetails}
                className={`text-xl font-semibold px-3 py-2.5 w-auto overflow-hidden hover:bg-slate-700/30 transition-all rounded-lg group ${currentTheme.textColor}`}
            >
                <span className='flex items-center gap-2.5'>
                    <span className='font-bold text-2xl'>#</span>
                    <span className='font-bold'>{name}</span>
                </span>
                <ChevronDown className="size-5 ml-3 group-hover:translate-y-0.5 transition-transform duration-200" />
            </Button>
        </div>
    );
};