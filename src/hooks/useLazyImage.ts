import { useState, useRef, useEffect } from 'react';

interface UseLazyImageOptions {
  threshold?: number;
  rootMargin?: string;
  placeholder?: string;
}

interface UseLazyImageReturn {
  src: string;
  isInView: boolean;
  imgRef: React.RefObject<HTMLImageElement | null>;
}

export const useLazyImage = (
  src: string,
  options: UseLazyImageOptions = {}
): UseLazyImageReturn => {
  const { threshold = 0.1, rootMargin = '50px', placeholder } = options;

  const [isInView, setIsInView] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder || '');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          setCurrentSrc(src);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, threshold, rootMargin]);

  return {
    src: currentSrc,
    isInView,
    imgRef,
  };
};
