'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  speed = 0.5,
  direction = 'up'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const { scrollY } = useScroll();

  const y = useTransform(
    scrollY,
    [elementTop, elementTop + clientHeight],
    direction === 'up' ? [0, -clientHeight * speed] : [0, clientHeight * speed]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      setElementTop(rect.top + scrollTop);
      setClientHeight(window.innerHeight);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxSection;
