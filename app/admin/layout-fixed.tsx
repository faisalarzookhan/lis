import React from 'react';
import AdminSidebar from '../../src/components/admin/AdminSidebar-fixed';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-bg dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
