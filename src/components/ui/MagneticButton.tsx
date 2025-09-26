'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMagneticEffect } from '../../hooks/useMagneticEffect';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  magneticStrength?: number;
  magneticRange?: number;
  disabled?: boolean;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  magneticStrength = 0.3,
  magneticRange = 100,
  disabled = false
}) => {
  const magneticRef = useMagneticEffect({
    strength: magneticStrength,
    range: magneticRange,
    enabled: !disabled
  });

  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';

  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent-dark focus:ring-accent shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white focus:ring-accent'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      {/* Magnetic ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={{ scale: 0, opacity: 0.5 }}
        whileHover={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center space-x-2">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        ref={magneticRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={buttonClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={magneticRef as React.RefObject<HTMLButtonElement>}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
};

export default MagneticButton;
