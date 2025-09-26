import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, ThumbsUp, ThumbsDown } from 'lucide-react';
import Link from 'next/link';
import { ChatMessage } from '../../types';

interface MessageProps {
  message: ChatMessage;
  onFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
}

const Message: React.FC<MessageProps> = ({ message, onFeedback }) => {
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(message.feedback || null);

  useEffect(() => {
    const saved = localStorage.getItem(`feedback-${message.id}`);
    if (saved) setFeedbackGiven(saved);
  }, [message.id]);

  useEffect(() => {
    if (feedbackGiven) localStorage.setItem(`feedback-${message.id}`, feedbackGiven);
  }, [feedbackGiven, message.id]);

  const handleFeedbackClick = (feedback: 'positive' | 'negative') => {
    if (!feedbackGiven) {
      setFeedbackGiven(feedback);
      onFeedback(message.id, feedback);
    }
  };

  const isUser = message.sender === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          <Bot size={18} className="text-gray-500" aria-label="Bot avatar" />
        </div>
      )}
      <div className={`flex flex-col max-w-sm md:max-w-md ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-accent text-white rounded-br-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-lg'
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>

          {/* Structured data rendering remains the same */}
          {message.structuredData?.type === 'serviceList' && (
             <div className="mt-3 border-t border-gray-200 dark:border-gray-600 pt-3 space-y-2">
               {message.structuredData.items.map(item => (
                 <Link
                   key={item.link}
                   href={item.link || '#'}
                   className="block text-accent dark:text-accent-orange font-medium hover:underline"
                 >
                   {item.title} &rarr;
                 </Link>
               ))}
             </div>
           )}
        </div>

        <div className="text-xs text-gray-400 mt-1.5 px-1 flex items-center space-x-2">
          <span>{time}</span>
          {!isUser && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleFeedbackClick('positive')}
                disabled={!!feedbackGiven}
                aria-label="Give positive feedback"
                className={`p-1 rounded-full transition-colors ${
                  feedbackGiven === 'positive' ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                }`}
              >
                <ThumbsUp size={14} />
              </button>
              <button
                onClick={() => handleFeedbackClick('negative')}
                disabled={!!feedbackGiven}
                aria-label="Give negative feedback"
                className={`p-1 rounded-full transition-colors ${
                  feedbackGiven === 'negative' ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
          <User size={18} className="text-gray-600 dark:text-gray-300" aria-label="User avatar" />
        </div>
      )}
    </motion.div>
  );
};

export default Message;
