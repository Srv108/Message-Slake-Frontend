import { useQueryClient } from '@tanstack/react-query';
import { Camera, Check, ChevronRight, Mail, Pencil, SquareArrowLeft, User2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateProfileDetails } from '@/hooks/api/user/useUpdateProfileDetails';
import { useUpdateProfilePic } from '@/hooks/api/user/useUpdateProfilePic';
import { useAcceptFile } from '@/hooks/context/useAcceptFile';
import { useAuth } from '@/hooks/context/useAuth';
import { useToast } from '@/hooks/use-toast';

export const ProfileEditDrawer = ({ open, onOpenChange }) => {
    const { auth } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { file, setFile, setPreview, setOpenAcceptFileModal } = useAcceptFile();
    const { updateProfilePicMutation, isPending: isUploadingPic } = useUpdateProfilePic();
    const { updateProfileDetailsMutation, isPending: isUpdatingDetails } = useUpdateProfileDetails();

    // Editing state - track which field is being edited
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [error, setError] = useState('');

    // Reset editing state when drawer closes
    useEffect(() => {
        if (!open) {
            setEditingField(null);
            setEditValue('');
            setError('');
        }
    }, [open]);

    // Handle profile picture upload
    useEffect(() => {
        if (file) {
            handleUploadProfilePic();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);

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

    const handleUploadProfilePic = async () => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            await updateProfilePicMutation(formData);
            queryClient.invalidateQueries(`userDetails-${auth?.user?.id}`);
            
            toast({
                variant: 'success',
                title: 'Profile picture updated successfully!',
            });
        } catch (error) {
            console.log('Failed to upload the image', error);
            toast({
                variant: 'destructive',
                title: 'Failed to update profile picture',
                description: error?.message || 'Please try again',
            });
        } finally {
            setFile(null);
            setPreview(null);
        }
    };

    const handleEditField = (field, currentValue) => {
        setEditingField(field);
        setEditValue(currentValue || '');
        setError('');
    };

    const handleCancelEdit = () => {
        setEditingField(null);
        setEditValue('');
        setError('');
    };

    const validateField = (field, value) => {
        switch (field) {
            case 'username':
                if (!value.trim()) return 'Username is required';
                if (!/^[a-zA-Z0-9-_.]+$/.test(value)) {
                    return 'Username can only contain letters, numbers, -, _, and .';
                }
                break;
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                    return 'Please enter a valid email address';
                }
                break;
            case 'name':
                if (value && !value.trim()) return 'Name cannot be empty';
                break;
            case 'about':
                if (value.length > 150) return 'About must be less than 150 characters';
                break;
        }
        return '';
    };

    const handleSaveField = async () => {
        const validationError = validateField(editingField, editValue);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const payload = {
                name: editingField === 'name' ? editValue.trim() : auth?.user?.name || '',
                username: editingField === 'username' ? editValue.trim() : auth?.user?.username,
                about: editingField === 'about' ? editValue.trim() : auth?.user?.about || '',
                email: editingField === 'email' ? editValue.trim() : auth?.user?.email
            };

            await updateProfileDetailsMutation(payload);
            queryClient.invalidateQueries(`userDetails-${auth?.user?.id}`);
            
            toast({
                variant: 'success',
                title: 'Profile updated successfully!',
            });
            
            setEditingField(null);
            setEditValue('');
            setError('');
        } catch (error) {
            console.log('Failed to update profile', error);
            setError(error?.message || 'Failed to update. Please try again');
        }
    };

    // Generate initials from username
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Profile field item component
    const ProfileField = ({ icon: Icon, label, value, field, multiline = false }) => {
        const isEditing = editingField === field;

        if (isEditing) {
            return (
                <div className="px-6 py-4 bg-slate-800/50 border-l-4 border-teal-500">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-teal-400" />
                            <span className="text-sm font-medium text-slate-300">{label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                                disabled={isUpdatingDetails}
                                className="text-slate-400 hover:text-slate-200 h-8"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSaveField}
                                disabled={isUpdatingDetails}
                                className="bg-teal-600 hover:bg-teal-700 text-white h-8"
                            >
                                <Check className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    {multiline ? (
                        <Textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-slate-900 border-slate-700 text-slate-100 focus:border-teal-500 resize-none"
                            rows={4}
                            maxLength={150}
                            autoFocus
                        />
                    ) : (
                        <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-slate-900 border-slate-700 text-slate-100 focus:border-teal-500"
                            autoFocus
                        />
                    )}
                    {error && (
                        <p className="text-red-400 text-xs mt-2">{error}</p>
                    )}
                    {multiline && (
                        <p className="text-slate-500 text-xs mt-2 text-right">
                            {editValue.length}/150 characters
                        </p>
                    )}
                </div>
            );
        }

        return (
            <button
                onClick={() => handleEditField(field, value)}
                className="w-full px-6 py-4 hover:bg-slate-700/30 transition-colors text-left group"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <Icon className="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors" />
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 mb-1">{label}</p>
                            <p className="text-slate-200 break-words">
                                {value || <span className="text-slate-500 italic">Not set</span>}
                            </p>
                        </div>
                    </div>
                    <Pencil className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
                </div>
            </button>
        );
    };

    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-500 ease-in-out ${
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => onOpenChange(false)}
            />
            
            {/* Drawer */}
            <div className={`fixed left-0 top-0 h-full w-full md:w-1/2 lg:w-2/5 max-w-2xl bg-slack-medium border-r border-slate-700 shadow-2xl z-50 overflow-y-auto transform transition-all duration-500 ease-in-out ${
                open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}>
                {/* Header */}
                <div className="sticky top-0 z-10 bg-slack-medium border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
                        >
                            <SquareArrowLeft className="w-6 h-6 text-slate-300" strokeWidth={2.5} />
                        </button>
                        <h2 className="text-xl font-semibold text-slate-100">Profile</h2>
                    </div>
                </div>

                {/* Profile Picture Section */}
                <div className="relative bg-gradient-to-b from-teal-600/20 to-transparent py-12">
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <Avatar className="w-32 h-32 ring-4 ring-teal-500/30">
                                <AvatarImage src={auth?.user?.avatar} alt={auth?.user?.username} />
                                <AvatarFallback className="bg-teal-600 text-white text-4xl font-bold">
                                    {getInitials(auth?.user?.username)}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                onClick={() => setOpenAcceptFileModal(true)}
                                disabled={isUploadingPic}
                                className="absolute bottom-0 right-0 p-3 bg-teal-600 hover:bg-teal-700 rounded-full transition-colors shadow-lg disabled:opacity-50"
                            >
                                <Camera className="w-5 h-5 text-white" />
                            </button>
                        </div>
                        <p className="mt-4 text-lg font-semibold text-slate-100">
                            {auth?.user?.username}
                        </p>
                        <p className="text-sm text-slate-400">
                            {isUploadingPic ? 'Uploading photo...' : 'Tap to change photo'}
                        </p>
                    </div>
                </div>

                {/* Profile Fields */}
                <div className="mt-4">
                    <div className="px-6 py-2">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Profile Information
                        </h3>
                    </div>

                    <div className="divide-y divide-slate-700">
                        <ProfileField
                            icon={User2}
                            label="Name"
                            value={auth?.user?.name}
                            field="name"
                        />

                        <ProfileField
                            icon={User2}
                            label="Username"
                            value={auth?.user?.username}
                            field="username"
                        />

                        <ProfileField
                            icon={Mail}
                            label="Email"
                            value={auth?.user?.email}
                            field="email"
                        />

                        <ProfileField
                            icon={Pencil}
                            label="About"
                            value={auth?.user?.about}
                            field="about"
                            multiline
                        />
                    </div>
                </div>

                {/* Footer Info */}
                <div className="px-6 py-6 mt-8 border-t border-slate-700">
                    <div className="text-xs text-slate-500 space-y-2">
                        <p className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3" />
                            Tap any field to edit
                        </p>
                        <p className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3" />
                            Changes are saved automatically
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
