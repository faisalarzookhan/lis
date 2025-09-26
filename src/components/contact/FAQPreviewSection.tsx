'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQPreviewSectionProps {
  className?: string;
}

const FAQPreviewSection: React.FC<FAQPreviewSectionProps> = ({ className = '' }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'Do you offer remote services?',
      answer: 'Yes, we provide fully remote services for clients worldwide. Our team uses modern collaboration tools to ensure seamless communication and project delivery regardless of location.'
    },
    {
      id: '2',
      question: 'What is your typical project timeline?',
      answer: 'Project timelines vary based on complexity and scope. A typical web application takes 4-8 weeks, while complex AI solutions may take 3-6 months. We provide detailed timelines during our initial consultation.'
    },
    {
      id: '3',
      question: 'Do you provide ongoing support after project completion?',
      answer: 'Absolutely! We offer comprehensive maintenance and support packages to ensure your solution continues to perform optimally. This includes regular updates, security patches, and technical support.'
    },
    {
      id: '4',
      question: 'What technologies do you specialize in?',
      answer: 'We specialize in modern web technologies including React, Node.js, Python, AI/ML frameworks, cloud platforms (AWS, Azure, GCP), and mobile development. We stay current with the latest industry trends and best practices.'
    },
    {
      id: '5',
      question: 'How do you ensure project quality and security?',
      answer: 'We follow industry best practices including code reviews, automated testing, security audits, and compliance with standards like ISO 27001. All our solutions undergo rigorous quality assurance before delivery.'
    }
  ];

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <HelpCircle className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold">Quick Questions</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Find answers to our most frequently asked questions. Can't find what you're looking for?
          <a href="/faq" className="text-accent hover:underline ml-1">View all FAQs</a>
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden"
          >
            <button
              onClick={() => toggleExpanded(faq.id)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
              <motion.div
                animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 dark:border-gray-600"
                >
                  <div className="px-6 py-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Still have questions? Our team is here to help.
        </p>
        <motion.a
          href="/contact"
          className="inline-flex items-center space-x-2 bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Contact Our Team</span>
          <HelpCircle className="w-4 h-4" />
        </motion.a>
      </div>
    </div>
  );
};

export default FAQPreviewSection;
