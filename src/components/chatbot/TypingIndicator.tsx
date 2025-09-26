import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: -5,
      transition: {
        duration: 0.4,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
        <Bot size={20} className="text-gray-500" />
      </div>
      <div className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 rounded-bl-none">
        <div className="flex items-center space-x-1.5">
          <motion.div variants={dotVariants} className="w-2 h-2 bg-gray-400 rounded-full" />
          <motion.div variants={dotVariants} transition={{ delay: 0.1 }} className="w-2 h-2 bg-gray-400 rounded-full" />
          <motion.div variants={dotVariants} transition={{ delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
