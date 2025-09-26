import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Briefcase, MessageSquare, Target, Users, HelpCircle, LogOut, FolderKanban, Mail } from 'lucide-react';
import Logo from '../common/Logo';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { id: 'mail', label: 'Webmail', href: '/admin/mail', icon: Mail },
  { id: 'pages', label: 'Pages', href: '/admin/pages', icon: FileText },
  { id: 'portfolio', label: 'Portfolio', href: '/admin/portfolio', icon: Briefcase },
  { id: 'testimonials', label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { id: 'leads', label: 'Leads', href: '/admin/leads', icon: Target },
  { id: 'users', label: 'Users', href: '/admin/users', icon: Users },
  { id: 'faq', label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
];

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Logo />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/admin"
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <LogOut className="w-5 h-5" />
          <span>Exit Admin</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
