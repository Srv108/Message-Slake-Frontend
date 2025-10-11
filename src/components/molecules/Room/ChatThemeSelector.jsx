import { Check, Palette, Pipette, SquareArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useChatTheme } from '@/hooks/context/useChatTheme';

export const ChatThemeSelector = ({ open, onOpenChange }) => {
    const { chatTheme, setChatTheme, chatThemes, customColor, setCustomColor } = useChatTheme();
    const [tempColor, setTempColor] = useState(customColor);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    const handleThemeSelect = (themeId) => {
        setChatTheme(themeId);
    };

    const handleCustomColorChange = (e) => {
        const color = e.target.value;
        setTempColor(color);
        setCustomColor(color);
        setChatTheme('custom');
    };

    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 z-[80] transition-opacity duration-500 ease-in-out ${
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => onOpenChange(false)}
            />
            
            {/* Drawer */}
            <div className={`fixed right-0 top-0 h-full w-full md:w-1/2 lg:w-2/5 max-w-2xl bg-slack-medium border-l border-slate-700 shadow-2xl z-[90] overflow-y-auto transform transition-all duration-500 ease-in-out ${
                open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}>
                {/* Header */}
                <div className="sticky top-0 bg-slack-medium border-b border-slate-700 px-6 py-4 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-500/20 rounded-lg">
                                <Palette className="w-6 h-6 text-teal-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-100">Chat Themes</h2>
                                <p className="text-sm text-slate-400">Choose your chat background</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
                        >
                            <SquareArrowRight className="w-8 h-6 text-slate-300" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Theme Grid */}
                <div className="p-6 space-y-6">
                    {/* Default & Popular Themes */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                            Popular
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.values(chatThemes).slice(0, 4).map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => handleThemeSelect(theme.id)}
                                    className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                                        chatTheme === theme.id
                                            ? 'border-teal-500 ring-2 ring-teal-500/30'
                                            : 'border-slate-600 hover:border-slate-500'
                                    }`}
                                >
                                    {/* Theme Preview */}
                                    <div className={`h-32 ${theme.background} ${theme.pattern ? 'bg-pattern' : ''} relative`}>
                                        {/* Sample Messages */}
                                        <div className="absolute inset-0 p-3 flex flex-col gap-2">
                                            <div className="ml-auto max-w-[70%]">
                                                <div className="bg-teal-600 text-white text-xs rounded-lg px-3 py-1.5 shadow">
                                                    Hello!
                                                </div>
                                            </div>
                                            <div className="mr-auto max-w-[70%]">
                                                <div className={`${theme.messageBackground} ${theme.textColor} text-xs rounded-lg px-3 py-1.5 shadow`}>
                                                    Hi there!
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Selected Indicator */}
                                        {chatTheme === theme.id && (
                                            <div className="absolute top-2 right-2 bg-teal-500 rounded-full p-1">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Theme Name */}
                                    <div className="bg-slate-800 px-3 py-2">
                                        <p className="text-sm font-medium text-slate-200 text-center">
                                            {theme.name}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gradient Themes */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                            Gradient Themes
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.values(chatThemes).slice(4, 10).map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => handleThemeSelect(theme.id)}
                                    className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                                        chatTheme === theme.id
                                            ? 'border-teal-500 ring-2 ring-teal-500/30'
                                            : 'border-slate-600 hover:border-slate-500'
                                    }`}
                                >
                                    {/* Theme Preview */}
                                    <div className={`h-32 ${theme.background} relative`}>
                                        {/* Sample Messages */}
                                        <div className="absolute inset-0 p-3 flex flex-col gap-2">
                                            <div className="ml-auto max-w-[70%]">
                                                <div className="bg-teal-600 text-white text-xs rounded-lg px-3 py-1.5 shadow">
                                                    Hello!
                                                </div>
                                            </div>
                                            <div className="mr-auto max-w-[70%]">
                                                <div className={`${theme.messageBackground} ${theme.textColor} text-xs rounded-lg px-3 py-1.5 shadow`}>
                                                    Hi there!
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Selected Indicator */}
                                        {chatTheme === theme.id && (
                                            <div className="absolute top-2 right-2 bg-teal-500 rounded-full p-1">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Theme Name */}
                                    <div className="bg-slate-800 px-3 py-2">
                                        <p className="text-sm font-medium text-slate-200 text-center">
                                            {theme.name}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Color Picker */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Pipette className="w-4 h-4" />
                            Custom Color
                        </h3>
                        <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border-2 border-slate-600">
                            <div className="space-y-4">
                                {/* Color Preview */}
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div 
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-slate-600 shadow-lg flex-shrink-0"
                                        style={{ backgroundColor: tempColor }}
                                    />
                                    <div className="flex-1 w-full min-w-0">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Pick Your Color
                                        </label>
                                        <input
                                            type="color"
                                            value={tempColor}
                                            onChange={handleCustomColorChange}
                                            className="w-full h-12 rounded-lg cursor-pointer border-2 border-slate-600 bg-slate-700"
                                        />
                                    </div>
                                </div>
                                
                                {/* RGB Input */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Hex Color Code
                                    </label>
                                    <input
                                        type="text"
                                        value={tempColor}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                                setTempColor(value);
                                                if (value.length === 7) {
                                                    setCustomColor(value);
                                                    setChatTheme('custom');
                                                }
                                            }
                                        }}
                                        placeholder="#ffffff"
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                                    />
                                </div>

                                {/* Preview Messages */}
                                <div className="rounded-lg p-4 space-y-2" style={{ backgroundColor: tempColor }}>
                                    <div className="ml-auto max-w-[70%]">
                                        <div className="bg-teal-600 text-white text-xs rounded-lg px-3 py-2 shadow">
                                            Your message
                                        </div>
                                    </div>
                                    <div className="mr-auto max-w-[70%]">
                                        <div className="bg-white text-gray-900 text-xs rounded-lg px-3 py-2 shadow">
                                            Friend&apos;s message
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Minimal Themes */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                            Minimal
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.values(chatThemes).slice(10, -1).map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => handleThemeSelect(theme.id)}
                                    className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                                        chatTheme === theme.id
                                            ? 'border-teal-500 ring-2 ring-teal-500/30'
                                            : 'border-slate-600 hover:border-slate-500'
                                    }`}
                                >
                                    {/* Theme Preview */}
                                    <div className={`h-32 ${theme.background} relative`}>
                                        {/* Sample Messages */}
                                        <div className="absolute inset-0 p-3 flex flex-col gap-2">
                                            <div className="ml-auto max-w-[70%]">
                                                <div className="bg-teal-600 text-white text-xs rounded-lg px-3 py-1.5 shadow">
                                                    Hello!
                                                </div>
                                            </div>
                                            <div className="mr-auto max-w-[70%]">
                                                <div className={`${theme.messageBackground} ${theme.textColor} text-xs rounded-lg px-3 py-1.5 shadow`}>
                                                    Hi there!
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Selected Indicator */}
                                        {chatTheme === theme.id && (
                                            <div className="absolute top-2 right-2 bg-teal-500 rounded-full p-1">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Theme Name */}
                                    <div className="bg-slate-800 px-3 py-2">
                                        <p className="text-sm font-medium text-slate-200 text-center">
                                            {theme.name}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
