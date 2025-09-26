'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginGate from '../components/admin/LoginGate';

const Admin: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    router.push('/admin/dashboard');
  };

  if (!isAuthenticated) {
    return <LoginGate onSuccess={handleLoginSuccess} />;
  }

  return <div>Redirecting...</div>;
};

export default Admin;
