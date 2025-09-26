'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

interface RelatedQuestionsProps {
  currentFaq: FAQ;
  allFaqs: FAQ[];
  onQuestionClick: (faq: FAQ) => void;
  className?: string;
}

const RelatedQuestions: React.FC<RelatedQuestionsProps> = ({
  currentFaq,
  allFaqs,
  onQuestionClick,
  className = ''
}) => {
  // Simple keyword matching for related questions
  const getRelatedQuestions = () => {
    const currentWords = currentFaq.question.toLowerCase().split(' ')
      .concat(currentFaq.answer.toLowerCase().split(' '))
      .filter(word => word.length > 3); // Only consider meaningful words

    const related = allFaqs
      .filter(faq => faq.id !== currentFaq.id)
      .map(faq => {
        const faqWords = faq.question.toLowerCase().split(' ')
          .concat(faq.answer.toLowerCase().split(' '));

        const matches = currentWords.filter(word =>
          faqWords.some(faqWord => faqWord.includes(word) || word.includes(faqWord))
        ).length;

        return { faq, relevance: matches };
      })
      .filter(item => item.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3); // Top 3 related questions

    return related.map(item => item.faq);
  };

  const relatedQuestions = getRelatedQuestions();

  if (relatedQuestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg ${className}`}
    >
      <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
        <ArrowRight className="w-4 h-4 mr-2" />
        You might also ask:
      </h4>

      <div className="space-y-2">
        {relatedQuestions.map((faq, index) => (
          <motion.button
            key={faq.id}
            onClick={() => onQuestionClick(faq)}
            className="w-full text-left p-3 bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group"
            whileHover={{ x: 4 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                {faq.question}
              </span>
              <ArrowRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {faq.category && (
              <span className="text-xs text-blue-600 dark:text-blue-400 mt-1 block">
                {faq.category}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedQuestions;
