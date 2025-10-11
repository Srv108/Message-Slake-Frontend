
import { Button } from '@/components/ui/button';

export const SidebarButton = ({
    Icon, 
    label,
    iconOnClick
}) => {

    return (
        <div className="flex flex-col items-center justify-center cursor-pointer gap-y-0.5 group">
            <Button
                variant="default"
                onClick={(iconOnClick) ? iconOnClick : null}
                className="size-9 p-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600"
            >
                <Icon className="size-5 text-gray-700 dark:text-white group-hover:scale-110 transition-all" />
            </Button>
            <span
                className="text-[10px] text-gray-700 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 font-medium transition-colors"
            >
                {label}
            </span>
        </div>
    );
};