import { createContext, useEffect, useState } from 'react';

export const ChatThemeContext = createContext();

// Chat theme configurations
export const chatThemes = {
    default: {
        id: 'default',
        name: 'Default',
        background: 'bg-white',
        messageBackground: 'bg-white',
        pattern: null,
        textColor: 'text-gray-900'
    },
    whatsappLight: {
        id: 'whatsappLight',
        name: 'WhatsApp Light',
        background: 'bg-[#efeae2]',
        messageBackground: 'bg-white',
        pattern: 'whatsapp-light',
        textColor: 'text-gray-900'
    },
    whatsappDark: {
        id: 'whatsappDark',
        name: 'WhatsApp Dark',
        background: 'bg-[#0b141a]',
        messageBackground: 'bg-[#1f2c34]',
        pattern: 'whatsapp-dark',
        textColor: 'text-gray-100'
    },
    telegramBlue: {
        id: 'telegramBlue',
        name: 'Telegram Blue',
        background: 'bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100',
        messageBackground: 'bg-white',
        pattern: null,
        textColor: 'text-gray-900'
    },
    telegramDark: {
        id: 'telegramDark',
        name: 'Telegram Dark',
        background: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
        messageBackground: 'bg-slate-800',
        pattern: null,
        textColor: 'text-gray-100'
    },
    sunset: {
        id: 'sunset',
        name: 'Sunset',
        background: 'bg-gradient-to-br from-orange-200 via-pink-200 to-purple-300',
        messageBackground: 'bg-white/90',
        pattern: null,
        textColor: 'text-gray-900'
    },
    ocean: {
        id: 'ocean',
        name: 'Ocean',
        background: 'bg-gradient-to-br from-cyan-200 via-blue-300 to-indigo-400',
        messageBackground: 'bg-white/90',
        pattern: null,
        textColor: 'text-gray-900'
    },
    forest: {
        id: 'forest',
        name: 'Forest',
        background: 'bg-gradient-to-br from-green-200 via-emerald-300 to-teal-400',
        messageBackground: 'bg-white/90',
        pattern: null,
        textColor: 'text-gray-900'
    },
    midnight: {
        id: 'midnight',
        name: 'Midnight',
        background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
        messageBackground: 'bg-slate-800/80',
        pattern: null,
        textColor: 'text-gray-100'
    },
    lavender: {
        id: 'lavender',
        name: 'Lavender',
        background: 'bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200',
        messageBackground: 'bg-white/90',
        pattern: null,
        textColor: 'text-gray-900'
    },
    minimal: {
        id: 'minimal',
        name: 'Minimal Gray',
        background: 'bg-gray-100',
        messageBackground: 'bg-white',
        pattern: null,
        textColor: 'text-gray-900'
    },
    darkMode: {
        id: 'darkMode',
        name: 'Dark Mode',
        background: 'bg-[#1a1a1a]',
        messageBackground: 'bg-[#2a2a2a]',
        pattern: null,
        textColor: 'text-gray-100'
    },
    custom: {
        id: 'custom',
        name: 'Custom',
        background: 'bg-white',
        messageBackground: 'bg-white',
        pattern: null,
        textColor: 'text-gray-900',
        isCustom: true
    }
};

export const ChatThemeProvider = ({ children }) => {
    const [chatTheme, setChatTheme] = useState(() => {
        const savedTheme = localStorage.getItem('chatTheme');
        return savedTheme || 'default';
    });

    const [customColor, setCustomColor] = useState(() => {
        const savedColor = localStorage.getItem('customChatColor');
        return savedColor || '#ffffff';
    });

    useEffect(() => {
        localStorage.setItem('chatTheme', chatTheme);
    }, [chatTheme]);

    useEffect(() => {
        localStorage.setItem('customChatColor', customColor);
    }, [customColor]);

    const getCurrentTheme = () => {
        if (chatTheme === 'custom') {
            return {
                ...chatThemes.custom,
                background: '',
                customBackground: customColor
            };
        }
        return chatThemes[chatTheme] || chatThemes.default;
    };

    return (
        <ChatThemeContext.Provider value={{ chatTheme, setChatTheme, getCurrentTheme, chatThemes, customColor, setCustomColor }}>
            {children}
        </ChatThemeContext.Provider>
    );
};
