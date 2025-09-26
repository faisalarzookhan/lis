'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  sections: { id: string; title: string }[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);

      // Update active section based on scroll position
      const sectionElements = sections.map(section => {
        const element = document.getElementById(section.id);
        return element ? element.offsetTop : 0;
      });

      const currentSection = sectionElements.findIndex((offset, index) => {
        const nextOffset = sectionElements[index + 1] || Infinity;
        return scrollTop >= offset - 100 && scrollTop < nextOffset - 100;
      });

      if (currentSection !== -1) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="relative">
        {/* Progress Bar */}
        <div className="w-1 h-64 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-accent rounded-full"
            style={{ height: `${scrollProgress}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${scrollProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Section Indicators */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              className={`w-3 h-3 rounded-full mb-8 cursor-pointer transition-colors ${
                index === activeSection
                  ? 'bg-accent'
                  : index < activeSection
                  ? 'bg-accent/60'
                  : 'bg-gray-400 dark:bg-gray-600'
              }`}
              whileHover={{ scale: 1.2 }}
              onClick={() => {
                const element = document.getElementById(section.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                transform: `translateY(${index * 64}px)`,
              }}
            />
          ))}
        </div>

        {/* Section Labels */}
        <div className="ml-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              className={`mb-8 text-sm font-medium cursor-pointer transition-colors ${
                index === activeSection
                  ? 'text-accent'
                  : 'text-gray-600 dark:text-gray-400 hover:text-accent'
              }`}
              whileHover={{ x: 5 }}
              onClick={() => {
                const element = document.getElementById(section.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                transform: `translateY(${index * 64 - 8}px)`,
              }}
            >
              {section.title}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
