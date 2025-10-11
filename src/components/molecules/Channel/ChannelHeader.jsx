import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ChannelHeader = ({ name, onOpenDetails }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={onOpenDetails}
            className="border-b border-gray-200 dark:border-slate-700 h-[60px] flex items-center px-3 md:px-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/30 transition-all duration-300 shadow-sm group bg-white dark:bg-slack-medium"
        >
            {/* Back Button - Visible on mobile */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(-1);
                }}
                className="md:hidden p-2 -ml-2 mr-1 hover:bg-gray-200 dark:hover:bg-slate-700/30 rounded-full transition-colors duration-200"
                aria-label="Go back"
            >
                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-slate-300" />
            </button>

            <div className='flex items-center gap-2.5 text-xl font-semibold text-gray-900 dark:text-gray-100'>
                <span className='font-bold text-2xl'>#</span>
                <span className='font-bold'>{name}</span>
            </div>
        </div>
    );
};