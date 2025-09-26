'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, X, Loader2 } from 'lucide-react';

interface NewsletterSubscriptionProps {
  variant?: 'inline' | 'modal' | 'sticky-footer' | 'card';
  className?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  onSubscribe?: (email: string) => Promise<boolean>;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  variant = 'card',
  className = '',
  title = 'Stay Updated',
  description = 'Get the latest insights, tutorials, and industry news delivered to your inbox.',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe',
  successMessage = 'Thank you for subscribing! Check your email for confirmation.',
  onSubscribe
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = onSubscribe ? await onSubscribe(email) : true;

      if (success) {
        setIsSubscribed(true);
        setEmail('');
        if (variant === 'modal') {
          setTimeout(() => setShowModal(false), 3000);
        }
      } else {
        setError('Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSubscribed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            Successfully Subscribed!
          </h3>
          <p className="text-green-600 dark:text-green-400">
            {successMessage}
          </p>
        </motion.div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isLoading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-w-24"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>{buttonText}</span>
              )}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm"
            >
              <X className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}
        </>
      )}
    </form>
  );

  // Modal variant
  if (variant === 'modal') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors"
        >
          Subscribe to Newsletter
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{title}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {description}
              </p>

              {formContent}
            </motion.div>
          </div>
        )}
      </>
    );
  }

  // Sticky footer variant
  if (variant === 'sticky-footer') {
    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-40"
      >
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
            <div className="w-full sm:w-auto sm:min-w-80">
              {formContent}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Card variant (default)
  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 ${className}`}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>

        {formContent}
      </motion.div>
    );
  }

  // Inline variant
  return (
    <div className={`flex flex-col sm:flex-row gap-4 items-center ${className}`}>
      <div className="flex-1 text-center sm:text-left">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className="w-full sm:w-auto sm:min-w-80">
        {formContent}
      </div>
    </div>
  );
};

export default NewsletterSubscription;
