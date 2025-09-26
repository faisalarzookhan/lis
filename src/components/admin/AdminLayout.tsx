import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import Dashboard from './Dashboard';
import PagesManagement from './PagesManagement';
import PortfolioManagement from './PortfolioManagement';
import TestimonialsManagement from './TestimonialsManagement';
import LeadsManagement from './LeadsManagement';
import UsersManagement from './UsersManagement';

type AdminView = 'dashboard' | 'pages' | 'portfolio' | 'testimonials' | 'leads' | 'users';

const AdminLayout: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'pages':
        return <PagesManagement />;
      case 'portfolio':
        return <PortfolioManagement />;
      case 'testimonials':
        return <TestimonialsManagement />;
      case 'leads':
        return <LeadsManagement />;
      case 'users':
        return <UsersManagement />;
      case 'faq':
        return <FaqManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-bg dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default AdminLayout;
