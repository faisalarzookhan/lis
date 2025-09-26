'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Mail, ExternalLink } from 'lucide-react';

const AdminFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'API Reference', href: '#' },
        { name: 'Support', href: '#' },
        { name: 'Changelog', href: '#' }
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'GitHub', href: 'https://github.com', icon: Github },
        { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
        { name: 'Discord', href: '#', icon: ExternalLink },
        { name: 'Forum', href: '#', icon: ExternalLink }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
        { name: 'GDPR', href: '#' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Limitless</h3>
                <p className="text-sm text-gray-400">Admin Panel</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Powerful admin interface for managing your Limitless Infotech projects,
              leads, and content with ease.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Github className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="mailto:admin@limitlessinfotech.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Mail className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => {
                  const Icon = 'icon' in link ? link.icon : null;
                  return (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 text-sm"
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{link.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-800 pt-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">All Systems Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">API Status:</span>
                <span className="text-green-400 text-sm">Healthy</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Uptime:</span>
                <span className="text-green-400 text-sm">99.9%</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Version 2.1.0</span>
              <span className="text-gray-600">•</span>
              <span className="text-sm text-gray-400">Last updated: Today</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4 md:mb-0">
              <span>© {currentYear} Limitless Infotech Solutions.</span>
              <span>All rights reserved.</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by the Limitless Team</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"></div>
      </div>
    </footer>
  );
};

export default AdminFooter;
