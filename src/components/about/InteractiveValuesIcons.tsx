'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Users, Target, Zap, Heart, Globe } from 'lucide-react';

interface Value {
  id: string;
  icon: React.ReactNode;
  title: string;
  shortDescription: string;
  fullDescription: string;
  color: string;
}

interface InteractiveValuesIconsProps {
  className?: string;
}

const InteractiveValuesIcons: React.FC<InteractiveValuesIconsProps> = ({ className = '' }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const values: Value[] = [
    {
      id: 'innovation',
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation',
      shortDescription: 'Pushing boundaries with cutting-edge solutions',
      fullDescription: 'We prioritize cutting-edge AI research and development, staying ahead of industry trends to deliver solutions that not only meet current needs but anticipate future challenges.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'collaboration',
      icon: <Users className="w-8 h-8" />,
      title: 'Collaboration',
      shortDescription: 'Building partnerships that drive success',
      fullDescription: 'We believe in the power of collaboration. Our team works closely with clients as partners, ensuring every solution is tailored to your unique business needs and goals.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'excellence',
      icon: <Target className="w-8 h-8" />,
      title: 'Excellence',
      shortDescription: 'Delivering quality that exceeds expectations',
      fullDescription: 'Quality is at the core of everything we do. From initial consultation to final delivery, we maintain the highest standards to ensure exceptional results.',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'agility',
      icon: <Zap className="w-8 h-8" />,
      title: 'Agility',
      shortDescription: 'Adapting quickly to changing needs',
      fullDescription: 'In a fast-paced digital world, adaptability is key. Our agile approach allows us to pivot quickly, respond to feedback, and deliver solutions that evolve with your business.',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'integrity',
      icon: <Heart className="w-8 h-8" />,
      title: 'Integrity',
      shortDescription: 'Building trust through honest partnerships',
      fullDescription: 'Trust is the foundation of all our relationships. We conduct business with transparency, honesty, and a commitment to ethical practices in everything we do.',
      color: 'from-red-400 to-pink-500'
    },
    {
      id: 'global-impact',
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Impact',
      shortDescription: 'Creating solutions that matter worldwide',
      fullDescription: 'Our work extends beyond individual projects. We strive to create solutions that have a positive impact on businesses and communities around the world.',
      color: 'from-teal-400 to-cyan-500'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <motion.div
            key={value.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <motion.div
              className={`relative bg-gradient-to-br ${value.color} rounded-xl p-6 text-white cursor-pointer h-full min-h-[200px] flex flex-col items-center justify-center text-center group overflow-hidden`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedValue(selectedValue === value.id ? null : value.id)}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-white/20 rounded-xl" />
              </div>

              {/* Icon */}
              <motion.div
                className="relative z-10 mb-4"
                animate={selectedValue === value.id ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                {value.icon}
              </motion.div>

              {/* Title */}
              <h3 className="relative z-10 text-xl font-bold mb-2">{value.title}</h3>

              {/* Description */}
              <p className="relative z-10 text-sm opacity-90 leading-relaxed">
                {value.shortDescription}
              </p>

              {/* Expand Indicator */}
              <motion.div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                animate={selectedValue === value.id ? { scale: 1.2 } : { scale: 1 }}
              >
                <div className="w-2 h-2 bg-white rounded-full opacity-60" />
              </motion.div>
            </motion.div>

            {/* Expanded Content */}
            <AnimatePresence>
              {selectedValue === value.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full left-0 right-0 z-20 mt-2"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${value.color} rounded-lg flex items-center justify-center text-white`}>
                        {value.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-2">{value.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {value.fullDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Instruction Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-8 text-gray-600 dark:text-gray-400"
      >
        <p>Click on any value to learn more about our core principles</p>
      </motion.div>
    </div>
  );
};

export default InteractiveValuesIcons;
