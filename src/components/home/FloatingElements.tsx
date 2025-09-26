'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { createFloatingElements } from '../../utils/animationUtils';

interface FloatingElementsProps {
  count?: number;
  className?: string;
  colors?: string[];
  size?: 'sm' | 'md' | 'lg';
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  count = 5,
  className = '',
  colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'],
  size = 'md'
}) => {
  const elements = createFloatingElements(count);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute rounded-full opacity-20 ${sizeClasses[size]}`}
          style={{
            backgroundColor: colors[element.id % colors.length],
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -40, 40, 0],
            rotate: [0, 120, 240, 360],
            scale: [element.scale, element.scale * 1.2, element.scale * 0.8, element.scale],
          }}
          transition={{
            duration: 8 + element.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;
