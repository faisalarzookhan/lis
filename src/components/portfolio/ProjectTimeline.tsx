'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  challenges?: string;
  solutions?: string;
}

interface ProjectTimelineProps {
  items: TimelineItem[];
  className?: string;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ items, className = '' }) => {
  const getStatusIcon = (status: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'upcoming':
        return <Calendar className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'in-progress':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'upcoming':
        return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="relative flex items-start space-x-6"
          >
            {/* Timeline Node */}
            <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${getStatusColor(item.status)}`}>
              {getStatusIcon(item.status)}
            </div>

            {/* Content Card */}
            <motion.div
              className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{item.description}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {item.date}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : item.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {item.status === 'completed' ? 'Completed' :
                   item.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                </div>
              </div>

              {/* Challenges & Solutions */}
              {(item.challenges || item.solutions) && (
                <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  {item.challenges && (
                    <div>
                      <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center">
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                        Challenges
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{item.challenges}</p>
                    </div>
                  )}
                  {item.solutions && (
                    <div>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Solutions
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{item.solutions}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTimeline;
