import { ArrowLeft, EllipsisVertical, Phone, Search, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfileDetailsDrawer } from '@/components/molecules/Room/ProfileDetailsDrawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetMemberDetails } from '@/hooks/api/room/useGetMemberDetails';
import { useGetUserMedia } from '@/hooks/context/useGetUserMedia';

export const RoomHeader = ({ userID, roomId }) => {

    const navigate = useNavigate();
    const { isSuccess, RoomMember } = useGetMemberDetails(userID);
    const { setCallDialed, setRemoteUser } = useGetUserMedia();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Generate initials from username
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

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
    
    useEffect(() => {
        if(isSuccess){
            console.log('room member details is ',RoomMember);
            setRemoteUser({
                username: RoomMember?.username,
                id: RoomMember?._id,
                email: RoomMember?.email
            });
        }
    },[isSuccess,RoomMember,setRemoteUser]);

    return (
        <>
            <div className="border-b border-gray-200 dark:border-slate-700/50 h-[60px] flex items-center justify-between px-3 md:px-4 bg-white dark:bg-slack-medium shadow-sm backdrop-blur-sm">
                {/* Left Section: Back Button (Mobile) + Avatar + User Info */}
                <div 
                    className="flex items-center gap-2 md:gap-3 flex-1 min-w-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/20 -mx-2 px-2 py-1 rounded-lg transition-colors"
                    onClick={() => setIsDrawerOpen(true)}
                >
                    {/* Back Button - Visible on mobile */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(-1);
                        }}
                        className="md:hidden p-2 -ml-2 hover:bg-gray-200 dark:hover:bg-slate-700/30 rounded-full transition-colors duration-200"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-slate-300" />
                    </button>

                    {/* Avatar */}
                    <Avatar className="h-10 w-10 md:h-11 md:w-11 ring-2 ring-teal-500/20 hover:ring-teal-500/40 transition-all duration-200">
                        <AvatarImage 
                            src={RoomMember?.avatar} 
                            alt={RoomMember?.username}
                        />
                        <AvatarFallback className={`${getAvatarColor(RoomMember?.username)} text-white font-semibold text-sm`}>
                            {getInitials(RoomMember?.username)}
                        </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                        <h2 className="text-gray-900 dark:text-slate-100 font-semibold text-sm md:text-base truncate">
                            {RoomMember?.username || 'Loading...'}
                        </h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-xs text-gray-600 dark:text-slate-400 truncate">
                                {RoomMember?.email ? 'Online' : 'Loading...'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section: Action Buttons */}
                <div className="flex items-center gap-1">
                    {/* Search Button - Hidden on small mobile */}
                    <button 
                        className="hidden sm:flex p-2 hover:bg-gray-200 dark:hover:bg-slate-700/40 rounded-full transition-all duration-200 group"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5 text-gray-600 dark:text-slate-400 group-hover:text-teal-400 transition-colors" />
                    </button>

                    {/* Phone Call Button */}
                    <button 
                        className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700/40 rounded-full transition-all duration-200 group"
                        aria-label="Voice call"
                    >
                        <Phone className="w-5 h-5 text-gray-600 dark:text-slate-400 group-hover:text-teal-400 transition-colors" />
                    </button>

                    {/* Video Call Button */}
                    <button 
                        onClick={() => {
                            setCallDialed(true);
                            navigate(`/directMessages/chat/${roomId}/video/call`);
                        }}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700/40 rounded-full transition-all duration-200 group"
                        aria-label="Video call"
                    >
                        <Video className="w-5 h-5 text-gray-600 dark:text-slate-400 group-hover:text-teal-400 transition-colors" />
                    </button>

                    {/* More Options Menu */}
                    <button 
                        className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700/40 rounded-full transition-all duration-200 group"
                        aria-label="More options"
                    >
                        <EllipsisVertical className="w-5 h-5 text-gray-600 dark:text-slate-400 group-hover:text-teal-400 transition-colors" />
                    </button>
                </div>
            </div>

            {/* Profile Details Drawer */}
            <ProfileDetailsDrawer 
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                userDetails={RoomMember}
            />
        </>
    );
};