import { X } from 'lucide-react';

export const ProfileImageViewer = ({ open, onClose, imageUrl, username, email }) => {
    if (!open) return null;

    return (
        <>
            {/* Full screen overlay on mobile */}
            <div 
                className="md:hidden fixed inset-0 bg-black z-[60] flex flex-col animate-slideDown"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>
                
                {/* Image */}
                <div className="flex-1 flex items-center justify-center bg-black p-4">
                    <img
                        src={imageUrl}
                        alt={username}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
                
                {/* User Info */}
                <div className="p-6 bg-gradient-to-t from-slate-900 to-slate-800">
                    <h3 className="text-white text-xl font-semibold">{username}</h3>
                    {email && <p className="text-gray-300 text-sm mt-1">{email}</p>}
                </div>
            </div>

            {/* Inside drawer on desktop - expands inline */}
            <div className="hidden md:block w-full animate-slideDown">
                <div className="relative bg-slate-900">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    
                    {/* Image Container */}
                    <div className="w-full max-h-[70vh] flex items-center justify-center p-8">
                        <img
                            src={imageUrl}
                            alt={username}
                            className="max-w-full max-h-[70vh] object-contain rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
