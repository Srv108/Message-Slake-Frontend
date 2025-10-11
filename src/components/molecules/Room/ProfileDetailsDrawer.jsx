import { Mail, Phone, SquareArrowRight, Video } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ProfileImageExpanded } from '@/components/molecules/ProfileImageExpanded/ProfileImageExpanded';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const ProfileDetailsDrawer = ({ open, onOpenChange, userDetails }) => {
    const [showImageExpanded, setShowImageExpanded] = useState(false);
    
    // Generate initials from username
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Check if user has a valid image URL with proper extension
    const isValidImageUrl = (url) => {
        if (!url || url.trim() === '') return false;
        
        // Check if it's a data URL (base64)
        if (url.startsWith('data:image/')) return true;
        
        // Check if it starts with http/https
        if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
        
        // Check for valid image extensions
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.ico'];
        const lowerUrl = url.toLowerCase();
        
        // Check if URL contains any valid image extension
        return imageExtensions.some(ext => lowerUrl.includes(ext));
    };

    const hasValidImage = isValidImageUrl(userDetails?.avatar);

    // Generate consistent color from username
    const getAvatarColor = (name) => {
        if (!name) return 'bg-teal-600';
        const colors = [
            'bg-blue-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-red-500',
            'bg-orange-500',
            'bg-yellow-500',
            'bg-green-500',
            'bg-teal-500',
            'bg-cyan-500',
            'bg-indigo-500'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

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
            <div className={`fixed right-0 top-0 h-full w-full md:w-1/2 lg:w-2/5 max-w-2xl bg-slack-medium border-l border-slate-700 shadow-2xl z-50 overflow-y-auto transform transition-all duration-500 ease-in-out ${
                open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}>
                    {/* Back Button */}
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute left-4 top-4 p-2 rounded-full hover:bg-slate-700/50 transition-colors z-10"
                    >
                        <SquareArrowRight className="w-8 h-6 text-slate-300" strokeWidth={2.5} />
                    </button>

                    {/* Profile Header */}
                    <div className="relative bg-gradient-to-b from-teal-600/20 to-transparent pt-16 pb-8">
                        <div className="flex flex-col items-center">
                            {/* Toggle between small avatar and expanded image */}
                            {showImageExpanded && hasValidImage ? (
                                <ProfileImageExpanded 
                                    isOpen={showImageExpanded}
                                    imageUrl={userDetails?.avatar}
                                    onClose={() => setShowImageExpanded(false)}
                                    username={userDetails?.username}
                                />
                            ) : (
                                <Avatar 
                                    className={`w-32 h-32 ring-4 ring-teal-500/30 transition-all ${
                                        hasValidImage ? 'cursor-pointer hover:ring-teal-400' : ''
                                    }`}
                                    onClick={() => {
                                        if (hasValidImage) {
                                            setShowImageExpanded(true);
                                        }
                                    }}
                                >
                                    <AvatarImage src={userDetails?.avatar} alt={userDetails?.username} />
                                    <AvatarFallback className={`${getAvatarColor(userDetails?.username)} text-white text-4xl font-bold`}>
                                        {getInitials(userDetails?.username)}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <h2 className="mt-4 text-2xl font-semibold text-slate-100">
                                {userDetails?.username || 'Unknown User'}
                            </h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                                <p className="text-sm text-slate-400">Online</p>
                            </div>
                        </div>
                    </div>

                    {/* User Info Section */}
                    <div className="px-6 py-4 space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs text-slate-500 uppercase tracking-wide">Email</label>
                            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                                <Mail className="w-5 h-5 text-teal-400" />
                                <span className="text-slate-200">{userDetails?.email || 'Not available'}</span>
                            </div>
                        </div>

                        {/* Phone (if available) */}
                        {userDetails?.phone && (
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase tracking-wide">Phone</label>
                                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                                    <Phone className="w-5 h-5 text-teal-400" />
                                    <span className="text-slate-200">{userDetails.phone}</span>
                                </div>
                            </div>
                        )}

                        {/* Bio (if available) */}
                        {userDetails?.bio && (
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase tracking-wide">Bio</label>
                                <div className="p-3 bg-slate-800/50 rounded-lg">
                                    <p className="text-slate-200 text-sm leading-relaxed">{userDetails.bio}</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-4 space-y-3">
                            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
                                <Phone className="w-5 h-5" />
                                <span className="font-medium">Voice Call</span>
                            </button>
                            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                                <Video className="w-5 h-5" />
                                <span className="font-medium">Video Call</span>
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="pt-4 border-t border-slate-700">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">User ID</span>
                                    <span className="text-slate-300 font-mono text-xs">{userDetails?._id?.slice(-8) || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Member Since</span>
                                    <span className="text-slate-300">{userDetails?.createdAt ? new Date(userDetails.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    );
};