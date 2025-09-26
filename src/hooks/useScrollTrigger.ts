import { useEffect, useRef } from 'react';

interface ScrollTriggerOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  enabled?: boolean;
}

export const useScrollTrigger = (
  callback: (progress: number, entry: IntersectionObserverEntry) => void,
  options: ScrollTriggerOptions = {}
) => {
  const elementRef = useRef<HTMLElement>(null);
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false,
    enabled = true
  } = options;

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;
    let hasTriggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const progress = entry.intersectionRatio;

          if (triggerOnce && hasTriggered) return;

          if (progress >= threshold) {
            callback(progress, entry);
            if (triggerOnce) {
              hasTriggered = true;
            }
          }
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, threshold, rootMargin, triggerOnce, enabled]);

  return elementRef;
};
