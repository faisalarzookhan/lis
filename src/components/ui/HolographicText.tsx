'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HolographicTextProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  colors?: string[];
  speed?: number;
}

const HolographicText: React.FC<HolographicTextProps> = ({
  children,
  className = '',
  animated = true,
  colors = ['#00D4FF', '#FF0080', '#00FF88', '#FFAA00', '#AA00FF'],
  speed = 3
}) => {
  const textVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      textShadow: animated
        ? [
            `0 0 5px ${colors[0]}, 0 0 10px ${colors[0]}, 0 0 15px ${colors[0]}`,
            `0 0 5px ${colors[1]}, 0 0 10px ${colors[1]}, 0 0 15px ${colors[1]}`,
            `0 0 5px ${colors[2]}, 0 0 10px ${colors[2]}, 0 0 15px ${colors[2]}`,
            `0 0 5px ${colors[0]}, 0 0 10px ${colors[0]}, 0 0 15px ${colors[0]}`,
          ]
        : `0 0 5px ${colors[0]}, 0 0 10px ${colors[0]}, 0 0 15px ${colors[0]}`,
    },
    transition: {
      duration: speed,
      repeat: animated ? Infinity : 0,
      ease: "easeInOut"
    }
  };

  return (
    <motion.span
      className={`holographic-text ${className}`}
      variants={textVariants}
      initial="initial"
      animate="animate"
      style={{
        background: animated
          ? `linear-gradient(45deg, ${colors.join(', ')})`
          : `linear-gradient(45deg, ${colors[0]}, ${colors[0]})`,
        backgroundSize: '400% 400%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </motion.span>
  );
};

export default HolographicText;
