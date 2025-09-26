'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderOpen,
  MessageSquare,
  Mail,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Shield,
  Database,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Pages',
      href: '/admin/pages',
      icon: FileText,
    },
    {
      name: 'Projects',
      href: '/admin/projects',
      icon: FolderOpen,
    },
    {
      name: 'Testimonials',
      href: '/admin/testimonials',
      icon: MessageSquare,
    },
    {
      name: 'Leads',
      href: '/admin/leads',
      icon: Users,
    },
    {
      name: 'Mail',
      href: '/admin/mail',
      icon: Mail,
    },
    {
      name: 'FAQ',
      href: '/admin/faq',
      icon: Database,
    },
    {
      name: 'SEO',
      href: '/admin/seo',
      icon: BarChart3,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Shield,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <motion.div
      initial={{ width: isOpen ? 256 : 64 }}
      animate={{ width: isOpen ? 256 : 64 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white shadow-lg"
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-700">
        {isOpen && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold"
          >
            Admin Panel
          </motion.h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="ml-3"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-400"
          >
            Limitless Infotech Admin
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
