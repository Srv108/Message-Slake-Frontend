import { useQueryClient } from '@tanstack/react-query';
import { ArrowRightFromLine, Edit2, HashIcon, Loader, Save, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUpdateChannel } from '@/hooks/api/channel/useUpdateChannel';
import { useToast } from '@/hooks/use-toast';

export const ChannelDetailsDrawer = ({ open, channel, onClose }) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isEditingName, setIsEditingName] = useState(false);
    const [channelName, setChannelName] = useState(channel?.name || '');

    const { isPending, updateChannelMutation } = useUpdateChannel(channel?._id);

    const handleSaveName = async () => {
        if (!channelName.trim()) {
            toast({
                title: 'Error',
                description: 'Channel name cannot be empty',
                variant: 'destructive'
            });
            return;
        }

        if (channelName === channel?.name) {
            setIsEditingName(false);
            return;
        }

        try {
            await updateChannelMutation({ name: channelName });
            queryClient.invalidateQueries([`fetchChannel-${channel?._id}`]);
            toast({
                title: 'Success',
                description: 'Channel name updated successfully'
            });
            setIsEditingName(false);
        } catch (error) {
            console.log('error in updating channel', error);
            toast({
                title: 'Error',
                description: 'Failed to update channel name',
                variant: 'destructive'
            });
        }
    };

    const handleCancelEdit = () => {
        setChannelName(channel?.name || '');
        setIsEditingName(false);
    };

    return (
        <>
            {/* Overlay - covers the chat area */}
            <div 
                className={`absolute inset-0 bg-black/50 z-40 transition-opacity duration-500 ${
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />
            
            {/* Drawer - slides from right, full width of chat area */}
            <div className={`absolute inset-0 bg-white dark:bg-slack-medium shadow-2xl z-50 border-l border-gray-200 dark:border-slate-700 transform transition-transform duration-500 ease-out ${
                open ? 'translate-x-0' : 'translate-x-full'
            }`}>
                {/* Header */}
                <div className='flex items-center justify-between px-4 h-[50px] border-b border-gray-200 dark:border-slate-700'>
                    <h2 className='font-semibold text-lg text-gray-900 dark:text-slate-100'>Channel Details</h2>
                    <button
                        onClick={onClose}
                        className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700/50 transition-colors'
                    >
                        <ArrowRightFromLine className='w-5 h-5 text-gray-700 dark:text-slate-300' strokeWidth={3} />
                    </button>
                </div>

                {/* Content */}
                <ScrollArea className='h-[calc(100vh-50px)]'>
                    <div className='py-6'>
                        {/* Channel Icon & Name */}
                        <div className='flex flex-col items-center mb-6'>
                            <div className='relative group mb-4'>
                                <div className='size-24 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold text-4xl ring-4 ring-teal-500/30'>
                                    <HashIcon className='size-16' />
                                </div>
                            </div>
                            
                            <h3 className='text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1'>
                                # {channel?.name}
                            </h3>
                            
                            {channel?.description && (
                                <p className='text-sm text-gray-600 dark:text-slate-400 text-center max-w-md px-4'>
                                    {channel.description}
                                </p>
                            )}
                        </div>

                        {/* Channel Name Edit Section */}
                        <div className='px-4 mb-6'>
                            <div className='bg-gray-100 dark:bg-slate-800/50 rounded-lg p-4'>
                                <div className='flex items-center justify-between mb-3'>
                                    <p className='text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider'>
                                        Channel Name
                                    </p>
                                    {!isEditingName && (
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => setIsEditingName(true)}
                                            className='h-7 px-2 hover:bg-gray-200 dark:hover:bg-slate-700'
                                        >
                                            <Edit2 className='size-3 mr-1' />
                                            <span className='text-xs'>Edit</span>
                                        </Button>
                                    )}
                                </div>

                                {isEditingName ? (
                                    <div className='space-y-3'>
                                        <Input
                                            value={channelName}
                                            onChange={(e) => setChannelName(e.target.value)}
                                            placeholder='Enter channel name'
                                            className='bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100'
                                            disabled={isPending}
                                        />
                                        <div className='flex gap-2'>
                                            <Button
                                                onClick={handleSaveName}
                                                disabled={isPending}
                                                className='flex-1 bg-teal-600 hover:bg-teal-700'
                                            >
                                                {isPending ? (
                                                    <Loader className='size-4 animate-spin mr-2' />
                                                ) : (
                                                    <Save className='size-4 mr-2' />
                                                )}
                                                Save
                                            </Button>
                                            <Button
                                                onClick={handleCancelEdit}
                                                disabled={isPending}
                                                variant='outline'
                                                className='flex-1 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-700'
                                            >
                                                <X className='size-4 mr-2' />
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-slate-700/50 rounded'>
                                        <HashIcon className='size-4 text-teal-400' />
                                        <p className='text-sm text-gray-900 dark:text-slate-100 font-medium'>
                                            {channel?.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Channel Info */}
                        <div className='px-4 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700'>
                            <p className='text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-3'>
                                Channel Information
                            </p>
                            <div className='space-y-3 text-xs text-gray-600 dark:text-slate-400'>
                                <div className='flex justify-between items-center py-2 px-3 bg-gray-100 dark:bg-slate-800/30 rounded'>
                                    <span>Channel ID:</span>
                                    <span className='text-gray-800 dark:text-slate-300 font-mono text-[10px]'>{channel?._id}</span>
                                </div>
                                <div className='flex justify-between items-center py-2 px-3 bg-gray-100 dark:bg-slate-800/30 rounded'>
                                    <span>Created:</span>
                                    <span className='text-gray-800 dark:text-slate-300'>
                                        {channel?.createdAt ? new Date(channel.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className='flex justify-between items-center py-2 px-3 bg-gray-100 dark:bg-slate-800/30 rounded'>
                                    <span>Last Updated:</span>
                                    <span className='text-gray-800 dark:text-slate-300'>
                                        {channel?.updatedAt ? new Date(channel.updatedAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className='px-4 mt-6'>
                            <div className='bg-gray-100 dark:bg-slate-800/30 rounded-lg p-4'>
                                <p className='text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2'>
                                    About this channel
                                </p>
                                <p className='text-sm text-gray-700 dark:text-slate-300'>
                                    This is a channel in your workspace where team members can communicate and collaborate.
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </>
    );
};
