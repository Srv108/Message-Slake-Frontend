import { Plus, MessageSquare, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingActions = ({
  theme,
  toggleTheme,
  isHovered,
  handleAddWorkspace,
  handleAddMember,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  const actions = [
    {
      id: 'theme',
      icon: theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />,
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      onClick: toggleTheme,
      className: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'chat',
      icon: <MessageSquare className="w-5 h-5" />,
      label: 'New Chat',
      onClick: handleAddMember,
      className: 'bg-green-500 hover:bg-green-600',
    },
    {
      id: 'workspace',
      icon: <Plus className="w-5 h-5" />,
      label: 'New Workspace',
      onClick: handleAddWorkspace,
      className: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-4 z-50">
      {actions.map((action) => (
        <div key={action.id} className="relative">
          <motion.button
            className={`w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center transition-all duration-300 ${action.className}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            onMouseEnter={() => handleMouseEnter(action.id)}
            onMouseLeave={handleMouseLeave}
            aria-label={action.label}
          >
            {action.icon}
          </motion.button>
          
          {isHovered === action.id && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded whitespace-nowrap"
            >
              {action.label}
              <div className="absolute right-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FloatingActions;
