'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Shield, Star } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

interface Award {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  image?: string;
  verificationUrl?: string;
  category: 'certification' | 'award' | 'recognition';
}

interface AwardsCertificationsProps {
  awards: Award[];
  className?: string;
}

const AwardsCertifications: React.FC<AwardsCertificationsProps> = ({ awards, className = '' }) => {
  const getIcon = (category: Award['category']) => {
    switch (category) {
      case 'certification':
        return <Shield className="w-6 h-6 text-blue-500" />;
      case 'award':
        return <Award className="w-6 h-6 text-yellow-500" />;
      case 'recognition':
        return <Star className="w-6 h-6 text-purple-500" />;
    }
  };

  const getCategoryColor = (category: Award['category']) => {
    switch (category) {
      case 'certification':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'award':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'recognition':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {awards.map((award, index) => (
        <motion.div
          key={award.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-600"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {award.image ? (
                <LazyImage
                  src={award.image}
                  alt={award.title}
                  width={60}
                  height={60}
                  className="w-15 h-15 rounded-lg object-cover"
                />
              ) : (
                <div className="w-15 h-15 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                  {getIcon(award.category)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(award.category)}`}>
                  {award.category.charAt(0).toUpperCase() + award.category.slice(1)}
                </span>
                <span className="text-sm font-semibold text-accent">{award.year}</span>
              </div>

              <h3 className="text-lg font-bold mb-1 line-clamp-2">{award.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {award.issuer}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{award.description}</p>

              {award.verificationUrl && (
                <motion.a
                  href={award.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 mt-3 text-accent hover:text-accent-dark transition-colors text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Verify</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AwardsCertifications;
