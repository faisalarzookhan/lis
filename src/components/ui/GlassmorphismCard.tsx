'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  hover?: boolean;
  animated?: boolean;
}

const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  className = '',
  intensity = 0.1,
  hover = true,
  animated = true
}) => {
  const glassStyles = {
    backdropFilter: `blur(${intensity * 20}px) saturate(180%)`,
    backgroundColor: `rgba(255, 255, 255, ${intensity})`,
    border: `1px solid rgba(255, 255, 255, ${intensity * 0.5})`,
    boxShadow: `0 8px 32px 0 rgba(31, 38, 135, ${intensity * 0.37})`,
  };

  const Component = animated ? motion.div : 'div';

  const props = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    whileHover: hover ? {
      scale: 1.02,
      boxShadow: `0 12px 40px 0 rgba(31, 38, 135, ${intensity * 0.5})`
    } : undefined,
  } : {};

  return (
    <Component
      className={`rounded-xl overflow-hidden ${className}`}
      style={glassStyles}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassmorphismCard;
