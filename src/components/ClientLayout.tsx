'use client';

import React, { useEffect } from 'react';
import Navigation from './common/Navigation';
import Footer from './common/Footer';
import ChatbotWidget from './chatbot/ChatbotWidget';
import PWA from './PWA';
import '../lib/i18n';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.setAttribute('crxlauncher', '');
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navigation />
      <main>
        {children}
      </main>
      <Footer />
      <ChatbotWidget />
      <PWA />
    </div>
  );
}
