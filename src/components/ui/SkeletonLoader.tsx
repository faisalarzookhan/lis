'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  rounded = true,
}) => {
  return (
    <motion.div
      className={`bg-gray-200 dark:bg-gray-700 ${rounded ? 'rounded' : ''} ${className}`}
      style={{ width, height }}
      animate={{
        backgroundColor: [
          'rgb(229 231 235)', // gray-200
          'rgb(156 163 175)', // gray-400
          'rgb(229 231 235)', // gray-200
        ],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export default SkeletonLoader;
