import { useEffect, useRef } from 'react';

interface MorphingOptions {
  duration?: number;
  easing?: string;
  enabled?: boolean;
}

export const useMorphingAnimation = (
  options: MorphingOptions = {}
) => {
  const elementRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const {
    duration = 8000,
    easing = 'ease-in-out',
    enabled = true
  } = options;

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const path = elementRef.current;
    const paths = [
      'M0,50 Q25,0 50,50 T100,50 Q75,100 50,50 T0,50',
      'M0,50 Q50,0 100,50 Q50,100 0,50',
      'M0,50 L25,25 L50,75 L75,25 L100,50 L75,75 L50,25 L25,75 L0,50',
      'M0,50 Q30,20 50,50 Q70,80 100,50 Q80,20 50,50 Q20,80 0,50',
    ];

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = (elapsed % duration) / duration;

      // Apply easing
      let easedProgress = progress;
      if (easing === 'ease-in-out') {
        easedProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      }

      const pathIndex = Math.floor(easedProgress * (paths.length - 1));
      const nextPathIndex = Math.min(pathIndex + 1, paths.length - 1);
      const pathProgress = (easedProgress * (paths.length - 1)) % 1;

      // Simple interpolation between paths
      const currentPath = paths[pathIndex];
      const nextPath = paths[nextPathIndex];

      // For now, just switch between paths
      path.setAttribute('d', pathProgress < 0.5 ? currentPath : nextPath);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [duration, easing, enabled]);

  return elementRef;
};
