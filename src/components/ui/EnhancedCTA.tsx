'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface EnhancedCTAProps {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gradient' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
}

const EnhancedCTA: React.FC<EnhancedCTAProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'right',
  onClick,
  disabled = false,
  external = false
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';

  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent-dark focus:ring-accent shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-500',
    gradient: 'bg-gradient-to-r from-accent to-accent-dark text-white hover:from-accent-dark hover:to-accent focus:ring-accent shadow-lg hover:shadow-xl',
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
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Sparkle Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial="hidden"
        whileHover="visible"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            variants={{
              hidden: { opacity: 0, scale: 0 },
              visible: {
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * 100 - 50,
                y: Math.random() * 40 - 20
              }
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.2,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>

      {/* Content */}
      <span className="relative z-10 flex items-center space-x-2">
        {Icon && iconPosition === 'left' && (
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}

        <span>{children}</span>

        {Icon && iconPosition === 'right' && (
          <motion.div
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}

        {!Icon && variant !== 'outline' && (
          <motion.div
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        )}
      </span>

      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
        }}
      />
    </>
  );

  if (href) {
    const linkProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

    return (
      <Link href={href} className={buttonClasses} {...linkProps}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button
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

export default EnhancedCTA;
