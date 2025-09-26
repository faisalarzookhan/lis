import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get theme from cookie or localStorage
    const getStoredTheme = (): Theme => {
      if (typeof window === 'undefined') return 'system';

      // Try cookie first (for SSR compatibility)
      const cookieTheme = document.cookie
        .split('; ')
        .find(row => row.startsWith('theme='))
        ?.split('=')[1] as Theme;

      if (cookieTheme && ['light', 'dark', 'system'].includes(cookieTheme)) {
        return cookieTheme;
      }

      // Fallback to localStorage
      const stored = localStorage.getItem('theme') as Theme;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored;
      }

      return 'system';
    };

    const storedTheme = getStoredTheme();
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    const applyTheme = (newTheme: Theme) => {
      if (newTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.toggle('dark', systemTheme === 'dark');
      } else {
        root.classList.toggle('dark', newTheme === 'dark');
      }
    };

    applyTheme(theme);

    // Store in both cookie and localStorage
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1); // 1 year expiry
    document.cookie = `theme=${theme}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, mounted]);

  return { theme, setTheme };
};
