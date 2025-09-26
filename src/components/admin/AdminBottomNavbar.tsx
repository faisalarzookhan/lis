'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  Target,
  Users,
  HelpCircle,
  LogOut,
  FolderKanban,
  Mail,
  Menu,
  X,
  Settings,
  BarChart3
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { id: 'mail', label: 'Webmail', href: '/admin/mail', icon: Mail },
  { id: 'pages', label: 'Pages', href: '/admin/pages', icon: FileText },
  { id: 'portfolio', label: 'Portfolio', href: '/admin/portfolio', icon: Briefcase },
  { id: 'testimonials', label: 'Reviews', href: '/admin/testimonials', icon: MessageSquare },
  { id: 'leads', label: 'Leads', href: '/admin/leads', icon: Target, badge: 12 },
  { id: 'users', label: 'Users', href: '/admin/users', icon: Users },
  { id: 'faq', label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
];

const AdminBottomNavbar: React.FC = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('');

  // Determine active item based on current path
  React.useEffect(() => {
    const currentItem = navItems.find(item => pathname.startsWith(item.href));
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [pathname]);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Main Bottom Navbar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        {/* Curved Background */}
        <div className="relative">
          <svg
            className="absolute bottom-0 left-0 right-0 w-full h-20"
            viewBox="0 0 400 80"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 Q200,20 400,80 L400,80 L0,80 Z"
              fill="white"
              className="dark:fill-gray-800"
            />
            <path
              d="M0,80 Q200,15 400,80"
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1"
              className="dark:stroke-gray-700"
            />
          </svg>

          {/* Navbar Content */}
          <div className="relative bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
            <div className="flex items-center justify-around max-w-md mx-auto">
              {/* First 4 items */}
              {navItems.slice(0, 4).map((item, index) => {
                const IconComponent = item.icon;
                const isActive = activeItem === item.id;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      onClick={() => handleItemClick(item.id)}
                      className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-accent text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="relative">
                        <IconComponent className="w-5 h-5" />
                        {item.badge && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                          >
                            {item.badge > 99 ? '99+' : item.badge}
                          </motion.span>
                        )}
                      </div>
                      <motion.span
                        className={`text-xs mt-1 font-medium ${
                          isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {item.label.split(' ')[0]}
                      </motion.span>
                    </Link>

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-accent rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                );
              })}

              {/* Menu Toggle */}
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  isExpanded
                    ? 'bg-accent text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
                <span className={`text-xs mt-1 font-medium ${
                  isExpanded ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  More
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expanded Menu Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Remaining nav items */}
                {navItems.slice(4).map((item, index) => {
                  const IconComponent = item.icon;
                  const isActive = activeItem === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <Link
                        href={item.href}
                        onClick={() => handleItemClick(item.id)}
                        className={`relative flex flex-col items-center justify-center w-full p-4 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-accent text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="relative mb-2">
                          <IconComponent className="w-6 h-6" />
                          {item.badge && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                              {item.badge > 99 ? '99+' : item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Settings */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <Link
                    href="/admin/seo"
                    onClick={() => handleItemClick('seo')}
                    className={`relative flex flex-col items-center justify-center w-full p-4 rounded-xl transition-all duration-300 ${
                      activeItem === 'seo'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Settings className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                </motion.div>

                {/* Analytics */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <Link
                    href="/admin/seo"
                    onClick={() => handleItemClick('analytics')}
                    className={`relative flex flex-col items-center justify-center w-full p-4 rounded-xl transition-all duration-300 ${
                      activeItem === 'analytics'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Analytics</span>
                  </Link>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <Link
                  href="/"
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Exit Admin Panel</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default AdminBottomNavbar;
