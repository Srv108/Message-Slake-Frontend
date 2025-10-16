'use client';

import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateChannel } from '@/hooks/api/channel/useCreateChannel';
import { useCreateChannelContext } from '@/hooks/context/useCreateChannelContext';
import { useWorkspace } from '@/hooks/context/useWorkspace';
import { useToast } from '@/hooks/use-toast';

export const CreateChannelModel = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const { currentWorkspace } = useWorkspace();
    const {
        openCreateChannelModal,
        setOpenCreateChannelModal,
        targetWorkspaceId,
    } = useCreateChannelContext();
    const { isPending, createChannelMutation } = useCreateChannel();

    // Use targetWorkspaceId if available, otherwise fall back to currentWorkspace
    const workspaceId = targetWorkspaceId || currentWorkspace?._id;

    async function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim() || !targetWorkspaceId) return;

        if (!workspaceId) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No workspace selected. Please try again.',
        });
        return;
        }

        try {
        await createChannelMutation({
            name: name,
            workspaceId: workspaceId,
        });
        toast({
            variant: 'success',
            title: `${name} channel created Successfully`,
        });
        queryClient.invalidateQueries(`fetchWorkspace-${workspaceId}`);
        } catch (error) {
        console.log('Failed to create channel', error);
        toast({
            variant: 'destructive',
            title: 'Failed to create channel',
            description: error?.message || 'Please try again.',
        });
        } finally {
        setName('');
        setOpenCreateChannelModal(false);
        }
    }

    return (
        <Drawer
            open={openCreateChannelModal}
            onOpenChange={setOpenCreateChannelModal}
            direction="left"
        >
        {/* DrawerContent now responsive */}
        <DrawerContent
            className="
            h-full 
            w-full 
            sm:max-w-md 
            md:max-w-lg 
            lg:max-w-xl 
            ml-0 
            bg-white dark:bg-gray-900
            border-r border-gray-200 dark:border-gray-800
            transition-all duration-300 ease-in-out
            "
        >
            <div className="h-full flex flex-col">
            {/* Header Section */}
            <DrawerHeader className="p-4 bg-gray-50 dark:bg-gray-800/60 flex justify-between items-start">
            {/* Text Section */}
            <div className="flex flex-col text-left">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Create Channel
                </h2>
                <DrawerDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-full">
                Channels are where your team communicates. They are best when organized around a topic.
                </DrawerDescription>
            </div>

            {/* Close Button */}
            <button
                onClick={() => setOpenCreateChannelModal(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-4 flex-shrink-0"
            >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="sr-only">Close</span>
            </button>
            </DrawerHeader>


            {/* Form Section */}
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col p-5 overflow-y-auto bg-white dark:bg-gray-900"
            >
                <div className="space-y-5 flex-1">
                <div className="space-y-2">
                    <Label
                    htmlFor="channel-name"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                    Channel Name
                    </Label>
                    <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 select-none">
                        #
                    </span>
                    <Input
                        id="channel-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. general"
                        className="
                        pl-8 
                        bg-gray-50 dark:bg-gray-800 
                        border-gray-200 dark:border-gray-700 
                        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                        text-gray-900 dark:text-gray-100
                        "
                        required
                        autoFocus
                    />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                    Names should be lowercase, without spaces or periods, and shorter than 30 characters.
                    </p>
                </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenCreateChannelModal(false)}
                    disabled={isPending}
                    className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isPending || !name.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    {isPending ? 'Creating...' : 'Create Channel'}
                </Button>
                </div>
            </motion.form>
            </div>
        </DrawerContent>
        </Drawer>
    );
};
