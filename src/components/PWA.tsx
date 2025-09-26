'use client';

import { useEffect } from 'react';

export default function PWA() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          // SW registered successfully
        })
        .catch(() => {
          // SW registration failed
        });
    }
  }, []);

  return null;
}
