'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  helpful?: number;
  notHelpful?: number;
}

interface FAQVotingSystemProps {
  faq: FAQ;
  onVote: (faqId: string, type: 'helpful' | 'notHelpful') => void;
  className?: string;
}

const FAQVotingSystem: React.FC<FAQVotingSystemProps> = ({
  faq,
  onVote,
  className = ''
}) => {
  const [userVote, setUserVote] = useState<'helpful' | 'notHelpful' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (type: 'helpful' | 'notHelpful') => {
    if (userVote || isVoting) return;

    setIsVoting(true);

    try {
      await onVote(faq.id, type);
      setUserVote(type);
    } catch (error) {
      console.error('Voting error:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const helpfulCount = faq.helpful || 0;
  const notHelpfulCount = faq.notHelpful || 0;
  const totalVotes = helpfulCount + notHelpfulCount;
  const helpfulPercentage = totalVotes > 0 ? Math.round((helpfulCount / totalVotes) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center justify-between mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg ${className}`}
    >
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">Was this helpful?</span>

        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => handleVote('helpful')}
            disabled={isVoting || userVote !== null}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-all ${
              userVote === 'helpful'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={{ scale: userVote ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThumbsUp className={`w-4 h-4 ${userVote === 'helpful' ? 'fill-current' : ''}`} />
            <span className="text-sm">Yes</span>
            {helpfulCount > 0 && (
              <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1 rounded">
                {helpfulCount}
              </span>
            )}
          </motion.button>

          <motion.button
            onClick={() => handleVote('notHelpful')}
            disabled={isVoting || userVote !== null}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-all ${
              userVote === 'notHelpful'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={{ scale: userVote ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThumbsDown className={`w-4 h-4 ${userVote === 'notHelpful' ? 'fill-current' : ''}`} />
            <span className="text-sm">No</span>
            {notHelpfulCount > 0 && (
              <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1 rounded">
                {notHelpfulCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Voting Stats */}
      {totalVotes > 0 && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>{helpfulPercentage}% found this helpful</span>
          <span className="text-gray-400">({totalVotes} votes)</span>
        </div>
      )}

      {/* Thank you message */}
      {userVote && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-green-600 dark:text-green-400 font-medium"
        >
          Thanks for your feedback!
        </motion.div>
      )}
    </motion.div>
  );
};

export default FAQVotingSystem;
