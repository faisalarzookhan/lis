'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  domContentLoaded: number | null;
  loadComplete: number | null;
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  enableLogging?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsUpdate,
  enableLogging = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    domContentLoaded: null,
    loadComplete: null
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry) => {
        const value = entry.startTime;

        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              updateMetric('fcp', value);
            }
            break;

          case 'largest-contentful-paint':
            updateMetric('lcp', value);
            break;

          case 'first-input':
            updateMetric('fid', (entry as any).processingStart - value);
            break;

          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              updateMetric('cls', metrics.cls ? metrics.cls + (entry as any).value : (entry as any).value);
            }
            break;

          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming;
            updateMetric('ttfb', navEntry.responseStart - navEntry.requestStart);
            updateMetric('domContentLoaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
            updateMetric('loadComplete', navEntry.loadEventEnd - navEntry.loadEventStart);
            break;
        }
      });
    });

    // Observe performance entries
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });
    } catch (error) {
      console.warn('Performance monitoring not fully supported:', error);
    }

    // Fallback for browsers that don't support PerformanceObserver
    if (!('PerformanceObserver' in window)) {
      // Use traditional timing
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            updateMetric('ttfb', navigation.responseStart - navigation.requestStart);
            updateMetric('domContentLoaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
            updateMetric('loadComplete', navigation.loadEventEnd - navigation.loadEventStart);
          }
        }, 0);
      });
    }

    const updateMetric = (key: keyof PerformanceMetrics, value: number) => {
      setMetrics(prev => {
        const newMetrics = { ...prev, [key]: value };

        if (enableLogging) {
          console.log(`Performance Metric - ${key.toUpperCase()}:`, value, 'ms');
        }

        // Call the callback if provided
        if (onMetricsUpdate) {
          onMetricsUpdate(newMetrics);
        }

        return newMetrics;
      });
    };

    // Send metrics to analytics service (if available)
    const sendMetricsToAnalytics = (metrics: PerformanceMetrics) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'Performance Metrics',
          value: Math.round(metrics.fcp || 0),
          custom_map: {
            fcp: metrics.fcp,
            lcp: metrics.lcp,
            fid: metrics.fid,
            cls: metrics.cls
          }
        });
      }
    };

    // Send metrics when all core web vitals are collected
    const checkAndSendMetrics = () => {
      if (metrics.fcp && metrics.lcp && metrics.fid !== null && metrics.cls !== null) {
        sendMetricsToAnalytics(metrics);
      }
    };

    // Check metrics periodically
    const metricsCheckInterval = setInterval(checkAndSendMetrics, 1000);

    return () => {
      observer.disconnect();
      clearInterval(metricsCheckInterval);
    };
  }, [metrics.cls, onMetricsUpdate, enableLogging]);

  // This component doesn't render anything visible
  return null;
};

export default PerformanceMonitor;

// Utility function to get current performance metrics
export const getCurrentPerformanceMetrics = (): PerformanceMetrics => {
  if (typeof window === 'undefined') {
    return {
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      domContentLoaded: null,
      loadComplete: null
    };
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paintEntries = performance.getEntriesByType('paint');
  const lcpEntries = performance.getEntriesByType('largest-contentful-paint');

  return {
    fcp: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || null,
    lcp: lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : null,
    fid: null, // Would need to be tracked separately
    cls: null, // Would need to be tracked separately
    ttfb: navigation ? navigation.responseStart - navigation.requestStart : null,
    domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : null,
    loadComplete: navigation ? navigation.loadEventEnd - navigation.loadEventStart : null
  };
};

// Hook for using performance metrics in components
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(getCurrentPerformanceMetrics());

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(getCurrentPerformanceMetrics());
    };

    // Update metrics on page load
    window.addEventListener('load', updateMetrics);

    return () => {
      window.removeEventListener('load', updateMetrics);
    };
  }, []);

  return metrics;
};
