import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/hooks/context/useTheme';

// eslint-disable-next-line react/prop-types
export const Auth = ({children}) => {
    const { theme, toggleTheme } = useTheme();
    
    // Layout for auth related pages
    return (
        <div 
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4 transition-colors relative"
        >
            {/* Theme Toggle - Top Right */}
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-slate-300" />
                ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                )}
            </button>

            <div className="w-full max-w-md">
                {children}
            </div>

        </div>
    );
};