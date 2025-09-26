'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  ExternalLink,
  Share2,
  MessageCircle
} from 'lucide-react';

interface SocialPlatform {
  name: string;
  icon: React.ComponentType<any>;
  url: string;
  color: string;
  followers?: string;
  description: string;
}

interface SocialMediaIntegrationProps {
  className?: string;
}

const SocialMediaIntegration: React.FC<SocialMediaIntegrationProps> = ({ className = '' }) => {
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const socialPlatforms: SocialPlatform[] = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/company/limitless-infotech',
      color: 'bg-blue-600',
      followers: '5.2K',
      description: 'Professional updates and industry insights'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/limitlessinfotech',
      color: 'bg-blue-400',
      followers: '2.8K',
      description: 'Real-time updates and tech discussions'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@limitlessinfotech',
      color: 'bg-red-600',
      followers: '1.9K',
      description: 'Tutorials, demos, and tech talks'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/limitless-infotech',
      color: 'bg-gray-800',
      followers: '892',
      description: 'Open source projects and code samples'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/limitlessinfotech',
      color: 'bg-pink-600',
      followers: '3.1K',
      description: 'Behind-the-scenes and company culture'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/limitlessinfotech',
      color: 'bg-blue-700',
      followers: '4.7K',
      description: 'Community updates and events'
    }
  ];

  // Mock recent posts data (replace with actual API calls)
  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        platform: 'LinkedIn',
        content: 'Excited to announce our new AI-powered analytics dashboard! 🚀 #AI #Analytics #TechInnovation',
        timestamp: '2 hours ago',
        likes: 45,
        comments: 12,
        shares: 8
      },
      {
        id: 2,
        platform: 'Twitter',
        content: 'Just wrapped up an amazing project with our client! The results speak for themselves. #WebDevelopment #Success',
        timestamp: '5 hours ago',
        likes: 28,
        comments: 7,
        shares: 15
      },
      {
        id: 3,
        platform: 'YouTube',
        content: 'New tutorial: Building scalable React applications with TypeScript 🎥',
        timestamp: '1 day ago',
        likes: 156,
        comments: 23,
        shares: 67
      }
    ];

    setTimeout(() => {
      setRecentPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleShare = (platform: SocialPlatform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out Limitless Infotech Solutions - ${platform.description}`);

    let shareUrl = '';

    switch (platform.name) {
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'LinkedIn':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      default:
        navigator.clipboard.writeText(window.location.href);
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Connect With Us</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Follow us on social media for the latest updates, insights, and behind-the-scenes content
        </p>
      </div>

      {/* Social Platforms Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {socialPlatforms.map((platform, index) => {
          const IconComponent = platform.icon;
          return (
            <motion.a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{platform.name}</h4>
                  {platform.followers && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{platform.followers} followers</p>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {platform.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-accent group-hover:text-accent-dark transition-colors">
                  Follow Us
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" />
              </div>

              {/* Hover Share Button */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleShare(platform);
                  }}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* Recent Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center space-x-2 mb-6">
          <MessageCircle className="w-5 h-5 text-accent" />
          <h4 className="text-lg font-semibold">Recent Activity</h4>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="border-l-4 border-accent pl-4 py-2">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-accent">{post.platform}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{post.content}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span>🔄 {post.shares}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <button className="text-accent hover:text-accent-dark font-medium transition-colors">
            View All Posts →
          </button>
        </div>
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-center bg-gradient-to-r from-accent to-accent-dark rounded-xl p-8 text-white"
      >
        <h4 className="text-xl font-bold mb-2">Stay Connected</h4>
        <p className="mb-6 opacity-90">
          Get the latest updates, industry insights, and exclusive content delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button className="bg-white text-accent px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SocialMediaIntegration;
