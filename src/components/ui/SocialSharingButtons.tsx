'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Mail,
  MessageCircle
} from 'lucide-react';

interface SocialSharingButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'floating';
  size?: 'sm' | 'md' | 'lg';
}

const SocialSharingButtons: React.FC<SocialSharingButtonsProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = typeof document !== 'undefined' ? document.title : '',
  description = '',
  className = '',
  variant = 'horizontal',
  size = 'md'
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400 hover:bg-blue-500',
      shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      shareUrl: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      shareUrl: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
    }
  ];

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    window.open(platform.shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const containerClasses = {
    horizontal: 'flex items-center space-x-2',
    vertical: 'flex flex-col space-y-2',
    floating: 'fixed bottom-6 right-6 z-50'
  };

  const buttonClasses = `flex items-center justify-center rounded-full text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${sizeClasses[size]}`;

  if (variant === 'floating') {
    return (
      <div className={containerClasses[variant]}>
        {/* Main Share Button */}
        <motion.button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className={`${buttonClasses} bg-accent hover:bg-accent-dark`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Share2 className={iconSizes[size]} />
        </motion.button>

        {/* Share Menu */}
        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 min-w-48"
          >
            <div className="flex flex-col space-y-3">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <button
                    key={platform.name}
                    onClick={() => handleShare(platform)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className={`w-8 h-8 ${platform.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{platform.name}</span>
                  </button>
                );
              })}

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center">
                  <LinkIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      {socialPlatforms.map((platform, index) => {
        const IconComponent = platform.icon;
        return (
          <motion.button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={`${buttonClasses} ${platform.color}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            title={`Share on ${platform.name}`}
          >
            <IconComponent className={iconSizes[size]} />
          </motion.button>
        );
      })}

      {/* Copy Link Button */}
      <motion.button
        onClick={handleCopyLink}
        className={`${buttonClasses} bg-gray-600 hover:bg-gray-700`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: socialPlatforms.length * 0.1 }}
        title="Copy Link"
      >
        {copied ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-400"
          >
            ✓
          </motion.div>
        ) : (
          <LinkIcon className={iconSizes[size]} />
        )}
      </motion.button>
    </div>
  );
};

export default SocialSharingButtons;
