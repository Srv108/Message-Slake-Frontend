import { useContext } from 'react';

import { ChatThemeContext } from '@/contexts/ChatThemeContext';

export const useChatTheme = () => {
    const context = useContext(ChatThemeContext);
    if (!context) {
        throw new Error('useChatTheme must be used within a ChatThemeProvider');
    }
    return context;
};
