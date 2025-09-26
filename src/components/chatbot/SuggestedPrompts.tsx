import React from 'react';
import { motion } from 'framer-motion';

interface SuggestedPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ prompts, onPromptClick }) => {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {prompts.map((prompt, idx) => (
        <motion.button
          key={idx}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPromptClick(prompt)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {prompt}
        </motion.button>
      ))}
    </div>
  );
};

export default SuggestedPrompts;
