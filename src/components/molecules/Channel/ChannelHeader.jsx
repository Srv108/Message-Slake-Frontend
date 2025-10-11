import { useChatTheme } from '@/hooks/context/useChatTheme';

export const ChannelHeader = ({ name, onOpenDetails }) => {
    const { getCurrentTheme } = useChatTheme();
    const currentTheme = getCurrentTheme();
    
    return (
        <div
            onClick={onOpenDetails}
            className={`border-b h-[60px] flex items-center px-5 cursor-pointer hover:bg-slate-700/30 transition-all duration-300 shadow-sm group ${currentTheme.messageBackground || 'bg-slack-medium'} ${currentTheme.textColor}`}
        >
            <div className='flex items-center gap-2.5 text-xl font-semibold'>
                <span className='font-bold text-2xl'>#</span>
                <span className='font-bold'>{name}</span>
            </div>
        </div>
    );
};