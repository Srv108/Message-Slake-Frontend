import { motion } from 'framer-motion';
import { useState } from 'react';

export const ActionButton = ({ 
    icon: Icon, 
    label, 
    onClick, 
    color = 'bg-emerald-500 hover:bg-emerald-600',
    className = '' 
    }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="relative">
        <motion.button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`w-12 h-12 rounded-full ${color} text-white flex items-center justify-center transition-all ${className}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <Icon className="w-5 h-5" />
        </motion.button>
        {isHovered && (
            <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-gray-800 dark:bg-gray-700 text-white text-sm px-3 py-1.5 rounded whitespace-nowrap z-50"
            >
            {label}
            <div className="absolute left-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-800 dark:bg-gray-700 rotate-45"></div>
            </motion.div>
        )}
        </div>
    );
};