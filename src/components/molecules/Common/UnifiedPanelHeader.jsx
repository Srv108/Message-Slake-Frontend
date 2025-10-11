import { MoreVertical, Search, SquareArrowLeft, SquarePlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export const UnifiedPanelHeader = ({
    appName = 'MessageSlake',
    workspaceName = null,
    onAddClick,
    addButtonLabel = 'Add New',
    menuItems = [],
    onSearch,
    searchPlaceholder = 'Search or start a new chat',
    showBackButton = false,
    onBackClick
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    return (
        <div className='flex flex-col bg-slack-medium border-b border-slate-700'>
            {/* Top Header - App Name, Plus Icon, Three Dots */}
            <div className='flex items-center justify-between px-4 h-[60px]'>
                {/* Left Side - Back Button + App Name */}
                <div className='flex items-center gap-2 flex-1'>
                    
                    {/* App Name / Workspace Name */}
                    <div className='flex flex-col'>
                        <h1 className='text-xl font-bold text-slate-100'>
                            {workspaceName ? workspaceName : appName}
                        </h1>
                    </div>
                </div>

                {/* Action Icons */}
                <div className='flex items-center gap-2'>
                    {/* Plus Icon */}
                    {onAddClick && (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={onAddClick}
                            className='size-10 rounded-full hover:bg-slate-700/50 transition-colors'
                            title={addButtonLabel}
                        >
                            <SquarePlusIcon className='size-5 text-slate-300' />
                        </Button>
                    )}

                    {/* Three Dots Menu */}
                    {menuItems.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='size-10 rounded-full hover:bg-slate-700/50 transition-colors'
                                >
                                    <MoreVertical className='size-5 text-slate-300' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-48 bg-slate-800 border-slate-700'>
                                {menuItems.map((item, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={item.onClick}
                                        className='text-slate-200 hover:bg-slate-700 cursor-pointer'
                                    >
                                        {item.icon && <span className='mr-2'>{item.icon}</span>}
                                        {item.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Back Button */}
                    {showBackButton && onBackClick && (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={onBackClick}
                            className='size-10 rounded-full hover:bg-slate-700/50 transition-colors'
                            title='Go Back'
                        >
                            <SquareArrowLeft className='w-6 h-6 text-slate-300' />
                        </Button>
                    )}
                    
                </div>
            </div>

            {/* Search Bar */}
            <div className='px-4 pb-4'>
                <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400' />
                    <Input
                        type='text'
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className='w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border-slate-600 text-slate-100 placeholder:text-slate-400 rounded-lg focus:bg-slate-700 transition-colors'
                    />
                </div>
            </div>
        </div>
    );
};
