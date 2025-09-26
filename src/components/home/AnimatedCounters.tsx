'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface CounterItem {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

interface AnimatedCountersProps {
  counters: CounterItem[];
  className?: string;
}

const AnimatedCounters: React.FC<AnimatedCountersProps> = ({
  counters,
  className = ''
}) => {
  const [counts, setCounts] = useState<number[]>(counters.map(() => 0));
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;

      counters.forEach((counter, index) => {
        const duration = counter.duration || 2000;
        const steps = 60;
        const increment = counter.value / steps;
        const stepDuration = duration / steps;

        let currentCount = 0;
        const timer = setInterval(() => {
          currentCount += increment;
          if (currentCount >= counter.value) {
            currentCount = counter.value;
            clearInterval(timer);
          }

          setCounts(prev => {
            const newCounts = [...prev];
            newCounts[index] = Math.floor(currentCount);
            return newCounts;
          });
        }, stepDuration);
      });
    }
  }, [isInView, counters]);

  return (
    <div ref={ref} className={`grid grid-cols-2 md:grid-cols-4 gap-8 ${className}`}>
      {counters.map((counter, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            className="text-4xl md:text-5xl font-bold text-accent mb-2"
            initial={{ scale: 0.5 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{
              delay: index * 0.1 + 0.3,
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
          >
            {counter.prefix}
            {counts[index].toLocaleString()}
            {counter.suffix}
          </motion.div>
          <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            {counter.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedCounters;
