'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  className?: string;
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items,
  className = ''
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 ${className}`}
    >
      {/* Home Link */}
      <Link
        href="/"
        className="flex items-center space-x-1 hover:text-accent transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <React.Fragment key={item.href}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.isActive ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-900 dark:text-white font-medium"
            >
              {item.label}
            </motion.span>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className="hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Utility function to generate breadcrumbs based on current path
export const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Convert segment to readable label
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    breadcrumbs.push({
      label,
      href: currentPath,
      isActive: index === pathSegments.length - 1
    });
  });

  return breadcrumbs;
};

export default BreadcrumbNavigation;
