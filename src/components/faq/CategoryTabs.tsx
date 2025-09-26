'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

interface CategoryTabsProps {
  faqs: FAQ[];
  onCategoryChange: (category: string | null) => void;
  className?: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  faqs,
  onCategoryChange,
  className = ''
}) => {
  // Get unique categories
  const categories = Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean))) as string[];
  const allCategory = null; // Represents "All"

  const [activeCategory, setActiveCategory] = useState<string | null>(allCategory);
  const [scrollPosition, setScrollPosition] = useState(0);

  const allCategories = [allCategory, ...categories];

  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  const scrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - 200));
  };

  const scrollRight = () => {
    const maxScroll = (allCategories.length - 1) * 120; // Approximate width per tab
    setScrollPosition(Math.min(maxScroll, scrollPosition + 200));
  };

  const getCategoryCount = (category: string | null) => {
    if (category === null) return faqs.length;
    return faqs.filter(faq => faq.category === category).length;
  };

  const getCategoryLabel = (category: string | null) => {
    if (category === null) return 'All';
    return category;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Navigation Arrows (Mobile) */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <button
          onClick={scrollLeft}
          disabled={scrollPosition === 0}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {getCategoryLabel(activeCategory)} ({getCategoryCount(activeCategory)})
        </div>

        <button
          onClick={scrollRight}
          disabled={scrollPosition >= (allCategories.length - 1) * 120}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs Container */}
      <div className="overflow-hidden">
        <motion.div
          className="flex space-x-2 md:space-x-4 pb-2"
          animate={{ x: -scrollPosition }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {allCategories.map((category, index) => (
            <motion.button
              key={category || 'all'}
              onClick={() => handleCategoryClick(category)}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="flex items-center space-x-2">
                <span>{getCategoryLabel(category)}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeCategory === category
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {getCategoryCount(category)}
                </span>
              </span>

              {/* Active Indicator */}
              {activeCategory === category && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="md:hidden mt-2 flex justify-center">
        <div className="flex space-x-1">
          {Array.from({ length: Math.ceil(allCategories.length / 3) }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                Math.floor(scrollPosition / 200) === i
                  ? 'bg-accent'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
