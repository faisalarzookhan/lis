'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

interface LoginGateProps {
  children?: React.ReactNode;
}

const LoginGate: React.FC<LoginGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const authToken = document.cookie.split('; ').find(row => row.startsWith('admin_auth_token='))?.split('=')[1];
        const authExpiry = document.cookie.split('; ').find(row => row.startsWith('admin_auth_expiry='))?.split('=')[1];

        if (authToken && authExpiry) {
          const expiry = new Date(authExpiry);
          if (expiry > new Date()) {
            setIsAuthenticated(true);
          } else {
            // Token expired, remove it
            document.cookie = 'admin_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'admin_auth_expiry=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    // Simple authentication (replace with real API call)
    if (email === 'admin@limitlessinfotech.com' && password === 'admin123') {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24); // 24 hours

      if (typeof window !== 'undefined') {
        document.cookie = `admin_auth_token=authenticated; expires=${expiry.toUTCString()}; path=/; SameSite=Strict`;
        document.cookie = `admin_auth_expiry=${expiry.toUTCString()}; expires=${expiry.toUTCString()}; path=/; SameSite=Strict`;
      }

      setIsAuthenticated(true);
    } else {
      setError('Invalid email or password');
    }

    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      document.cookie = 'admin_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'admin_auth_expiry=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setError('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Access
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Login Form */}
          <motion.form
            onSubmit={handleLogin}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="admin@limitlessinfotech.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-accent text-white py-3 px-4 rounded-lg font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Access Admin Panel</span>
                </>
              )}
            </button>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Demo Credentials:</strong>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Email: admin@limitlessinfotech.com<br />
                Password: admin123
              </p>
            </div>
          </motion.form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Logout"
      >
        <Lock className="w-5 h-5" />
      </motion.button>

      {children}
    </div>
  );
};

export default LoginGate;
