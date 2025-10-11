import { ChevronUp, ImageIcon, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';

import { WorkspaceInviteModal } from '@/components/organisms/Modals/WorkspaceInviteModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/context/useAuth';
import { useWorkspacePreferenceModal } from '@/hooks/context/useWorkspacePreferenceModal';

export const WorkspaceDetailsDrawer = ({ open, workspace, onClose }) => {
    const { auth } = useAuth();
    const [openInviteModal, setOpenInviteModal] = useState(false);
    const { setOpenWorkspacePreference } = useWorkspacePreferenceModal();
    
    const isLoggedInUserAdmin = workspace?.members?.find(
        (member) => member.memberId._id === auth?.user?.id && member.role === 'admin'
    );

    // Generate initials from username
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (!open) return null;

    return (
        <>
            <WorkspaceInviteModal
                workspaceId={workspace?._id}
                joinCode={workspace?.joinCode}
                workspaceName={workspace?.name}
                openInviteModal={openInviteModal}
                setOpenInviteModal={setOpenInviteModal}
            />

            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/40 z-30 animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Drawer - slides from top */}
            <div className="absolute inset-0 bg-slack-medium shadow-2xl z-40 animate-in slide-in-from-top duration-300">
                {/* Header */}
                <div className='flex items-center justify-between px-4 h-[50px] border-b border-slate-700'>
                    <h2 className='font-semibold text-lg text-slate-100'>Workspace Details</h2>
                    <button
                        onClick={onClose}
                        className='p-2 rounded-full hover:bg-slate-700/50 transition-colors'
                    >
                        <ChevronUp className='size-5 text-slate-300' />
                    </button>
                </div>

                {/* Content */}
                <ScrollArea className='h-[calc(100vh-50px)]'>
                    <div className='py-6'>
                        {/* Workspace Icon & Name */}
                        <div className='flex flex-col items-center mb-6'>
                            <div className='relative group mb-4'>
                                {workspace?.image ? (
                                    <div className='size-24 rounded-2xl overflow-hidden ring-4 ring-teal-500/30'>
                                        <img 
                                            src={workspace.image} 
                                            alt={workspace?.name}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                ) : (
                                    <div className='size-24 rounded-2xl bg-[#616061] flex items-center justify-center text-white font-bold text-4xl ring-4 ring-teal-500/30'>
                                        {workspace?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {isLoggedInUserAdmin && (
                                    <div className='absolute bottom-0 right-0 p-2 bg-teal-600 rounded-full'>
                                        <ImageIcon className='size-4 text-white' />
                                    </div>
                                )}
                            </div>
                            
                            <h3 className='text-2xl font-bold text-slate-100 mb-1'>
                                {workspace?.name}
                            </h3>
                            
                            {workspace?.description && (
                                <p className='text-sm text-slate-400 text-center max-w-md px-4'>
                                    {workspace.description}
                                </p>
                            )}
                        </div>

                        {/* Admin Actions */}
                        {isLoggedInUserAdmin && (
                            <div className='px-4 mb-6'>
                                <div className='bg-slate-800/50 rounded-lg p-4 space-y-2'>
                                    <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3'>
                                        Admin Actions
                                    </p>
                                    <Button
                                        variant='outline'
                                        className='w-full justify-start border-slate-600 hover:bg-slate-700'
                                        onClick={() => {
                                            setTimeout(() => {
                                                setOpenWorkspacePreference(true);
                                            }, 10);
                                        }}
                                    >
                                        Preferences
                                    </Button>
                                    <Button
                                        variant='outline'
                                        className='w-full justify-start border-slate-600 hover:bg-slate-700'
                                        onClick={() => {
                                            setTimeout(() => {
                                                setOpenInviteModal(true);
                                            }, 10);
                                        }}
                                    >
                                        Invite people to {workspace?.name}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Members Section */}
                        <div className='px-4'>
                            <div className='flex items-center justify-between mb-3'>
                                <h3 className='text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2'>
                                    <User className='size-4' />
                                    Members ({workspace?.members?.length || 0})
                                </h3>
                            </div>

                            <div className='space-y-2'>
                                {workspace?.members?.map((member) => {
                                    const isAdmin = member.role === 'admin';
                                    const isCurrentUser = member.memberId._id === auth?.user?.id;

                                    return (
                                        <div
                                            key={member.memberId._id}
                                            className='flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors'
                                        >
                                            {/* Avatar */}
                                            <Avatar className='size-10 ring-2 ring-slate-700'>
                                                <AvatarImage 
                                                    src={member.memberId.avatar} 
                                                    alt={member.memberId.username}
                                                />
                                                <AvatarFallback className='bg-teal-600 text-white font-semibold'>
                                                    {getInitials(member.memberId.username)}
                                                </AvatarFallback>
                                            </Avatar>

                                            {/* User Info */}
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center gap-2'>
                                                    <p className='text-sm font-medium text-slate-100 truncate'>
                                                        {member.memberId.username}
                                                    </p>
                                                    {isCurrentUser && (
                                                        <span className='text-xs text-teal-400 font-medium'>
                                                            (You)
                                                        </span>
                                                    )}
                                                </div>
                                                {member.memberId.email && (
                                                    <p className='text-xs text-slate-400 truncate'>
                                                        {member.memberId.email}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Admin Badge */}
                                            {isAdmin && (
                                                <div className='flex items-center gap-1 px-2 py-1 bg-amber-600/20 rounded-full'>
                                                    <ShieldCheck className='size-3 text-amber-400' />
                                                    <span className='text-xs font-medium text-amber-400'>
                                                        Admin
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Workspace Info */}
                        <div className='px-4 mt-6 pt-6 border-t border-slate-700'>
                            <div className='space-y-3 text-xs text-slate-400'>
                                <div className='flex justify-between'>
                                    <span>Workspace ID:</span>
                                    <span className='text-slate-300 font-mono'>{workspace?._id}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Total Channels:</span>
                                    <span className='text-slate-300'>{workspace?.channels?.length || 0}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Total Members:</span>
                                    <span className='text-slate-300'>{workspace?.members?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </>
    );
};
