'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, ArrowRight, Users, Lightbulb, TrendingUp } from 'lucide-react';

interface MissionVisionVisualsProps {
  className?: string;
}

const MissionVisionVisuals: React.FC<MissionVisionVisualsProps> = ({ className = '' }) => {
  const missionPoints = [
    'Solve real-world problems through innovative technology',
    'Build lasting partnerships with our clients',
    'Deliver exceptional quality in every solution',
    'Drive digital transformation for businesses worldwide'
  ];

  const visionPoints = [
    'Become the leading technology partner for businesses',
    'Pioneer cutting-edge solutions that shape industries',
    'Create a global network of successful digital transformations',
    'Set new standards for client satisfaction and innovation'
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: '120+', label: 'Happy Clients' },
    { icon: <Lightbulb className="w-6 h-6" />, value: '50+', label: 'Innovative Solutions' },
    { icon: <TrendingUp className="w-6 h-6" />, value: '300%', label: 'Average ROI' },
    { icon: <Target className="w-6 h-6" />, value: '98%', label: 'Success Rate' }
  ];

  return (
    <div className={`space-y-16 ${className}`}>
      {/* Mission & Vision Split Screen */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 h-full">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Our Mission</h3>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              To empower businesses with innovative technology solutions that drive growth,
              efficiency, and competitive advantage in the digital age.
            </p>

            <div className="space-y-3">
              {missionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <ArrowRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">{point}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 h-full">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Our Vision</h3>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              To be the premier technology partner that transforms businesses through
              intelligent, scalable, and future-ready digital solutions.
            </p>

            <div className="space-y-3">
              {visionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <ArrowRight className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">{point}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Impact Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8"
      >
        <h3 className="text-2xl font-bold text-center mb-8">Our Impact in Numbers</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <div className="text-accent">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold mb-4">Ready to Be Part of Our Vision?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Join hundreds of businesses that have transformed their operations with our innovative solutions.
          Let's discuss how we can help you achieve your goals.
        </p>
        <motion.button
          className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors inline-flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Start Your Transformation</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MissionVisionVisuals;
