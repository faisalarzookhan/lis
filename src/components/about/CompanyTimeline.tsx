'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, Users, TrendingUp } from 'lucide-react';

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  type: 'milestone' | 'award' | 'partnership' | 'growth' | 'certification';
  icon?: string;
}

interface CompanyTimelineProps {
  items: TimelineItem[];
  className?: string;
}

const CompanyTimeline: React.FC<CompanyTimelineProps> = ({ items, className = '' }) => {
  const getIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'milestone':
        return <TrendingUp className="w-6 h-6 text-blue-500" />;
      case 'award':
        return <Award className="w-6 h-6 text-yellow-500" />;
      case 'partnership':
        return <Users className="w-6 h-6 text-green-500" />;
      case 'growth':
        return <TrendingUp className="w-6 h-6 text-purple-500" />;
      default:
        return <Calendar className="w-6 h-6 text-gray-500" />;
    }
  };

  const getColor = (type: TimelineItem['type']) => {
    switch (type) {
      case 'milestone':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'award':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'partnership':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'growth':
        return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-purple-500" />

      <div className="space-y-12">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`relative flex items-start space-x-6 ${index % 2 === 1 ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            {/* Timeline Node */}
            <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${getColor(item.type)} shadow-lg`}>
              {getIcon(item.type)}
            </div>

            {/* Content Card */}
            <motion.div
              className={`flex-1 max-w-md ${index % 2 === 1 ? 'text-right' : ''}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 ${getColor(item.type)}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl font-bold text-accent">{item.year}</span>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    item.type === 'award' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    item.type === 'partnership' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    item.type === 'growth' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompanyTimeline;
