import { useEffect, useRef } from 'react';
import { throttle } from '../utils/animationUtils';

interface MagneticOptions {
  strength?: number;
  range?: number;
  enabled?: boolean;
}

export const useMagneticEffect = (
  options: MagneticOptions = {}
) => {
  const elementRef = useRef<HTMLElement>(null);
  const { strength = 0.3, range = 100, enabled = true } = options;

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;
    let isHovering = false;

    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!isHovering) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < range) {
        const force = (range - distance) / range;
        const moveX = deltaX * force * strength;
        const moveY = deltaY * force * strength;

        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      } else {
        element.style.transform = 'translate(0px, 0px)';
      }
    }, 16); // ~60fps

    const handleMouseEnter = () => {
      isHovering = true;
      element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    };

    const handleMouseLeave = () => {
      isHovering = false;
      element.style.transform = 'translate(0px, 0px)';
      element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [strength, range, enabled]);

  return elementRef;
};
