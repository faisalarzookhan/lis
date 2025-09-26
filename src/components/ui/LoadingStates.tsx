import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <Loader2 className="w-full h-full text-accent" />
    </motion.div>
  );
};

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  loadingText?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  onClick,
  disabled,
  className = '',
  loadingText = 'Loading...'
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative ${className}`}
    >
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-current bg-opacity-20 rounded"
        >
          <LoadingSpinner size="sm" className="text-current" />
        </motion.div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
      {loading && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {loadingText}
        </motion.span>
      )}
    </button>
  );
};

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  rounded = false,
  className = ''
}) => {
  return (
    <motion.div
      style={{ width, height }}
      className={`bg-gray-200 dark:bg-gray-700 ${rounded ? 'rounded' : ''} ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

interface SkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  showAvatar = false,
  className = ''
}) => {
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      {showAvatar && (
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton width="3rem" height="3rem" rounded />
          <div className="flex-1">
            <Skeleton width="60%" height="1rem" className="mb-2" />
            <Skeleton width="40%" height="0.75rem" />
          </div>
        </div>
      )}
      <div className="space-y-3">
        <Skeleton width="100%" height="1.25rem" />
        {Array.from({ length: lines - 1 }).map((_, index) => (
          <Skeleton
            key={index}
            width={`${Math.random() * 40 + 60}%`}
            height="1rem"
          />
        ))}
      </div>
    </div>
  );
};

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading...',
  className = ''
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};

interface RefreshButtonProps {
  onRefresh: () => void;
  loading?: boolean;
  className?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  loading = false,
  className = ''
}) => {
  return (
    <motion.button
      onClick={onRefresh}
      disabled={loading}
      className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={loading ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: 'linear' }}
      >
        <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </motion.div>
    </motion.button>
  );
};

interface ProgressLoaderProps {
  progress: number;
  message?: string;
  className?: string;
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  progress,
  message,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{message}</p>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className="bg-accent h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{progress}% complete</p>
    </div>
  );
};
