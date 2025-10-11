import { useCallback,useEffect, useRef, useState } from 'react';

export const ProfileImageExpanded = ({ 
    isOpen, 
    imageUrl, 
    onClose, 
    username 
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const expandedRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        // Wait for animation to complete before actually closing
        setTimeout(() => {
            onClose();
        }, 500); // Match animation duration (0.5s)
    }, [onClose]);

    // Handle clicks anywhere in the drawer
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            // If click is outside the expanded image container, close it
            if (expandedRef.current && !expandedRef.current.contains(event.target)) {
                handleClose();
            }
        };

        // Add event listener to document
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, handleClose]);

    if (!isOpen || !imageUrl) return null;

    return (
        <>
            {/* Mobile: Full screen overlay */}
            <div 
                className={`md:hidden fixed inset-0 bg-black/95 z-[60] flex flex-col ${
                    isClosing ? 'animate-slideUp' : 'animate-slideDown'
                }`}
                onClick={handleClose}
            >
                <div className="flex-1 flex items-center justify-center p-4">
                    <img
                        src={imageUrl}
                        alt={username}
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                </div>
            </div>

            {/* Desktop: Inline expansion within drawer */}
            <div 
                ref={expandedRef}
                className={`hidden md:block w-full ${
                    isClosing ? 'animate-slideUp' : 'animate-slideDown'
                }`}
            >
                <div className="relative w-full bg-black/40 backdrop-blur-sm py-8 px-4">
                    {/* Expanded Image */}
                    <div className="w-full flex items-center justify-center">
                        <img
                            src={imageUrl}
                            alt={username}
                            className="w-full max-w-lg h-auto object-cover rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
