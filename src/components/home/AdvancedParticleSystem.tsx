'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AdvancedParticleSystemProps {
  particleCount?: number;
  className?: string;
  colors?: string[];
  interactive?: boolean;
}

const AdvancedParticleSystem: React.FC<AdvancedParticleSystemProps> = ({
  particleCount = 100,
  className = '',
  colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'],
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      originalLife: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 200 + 100,
        originalLife: 0
      });
      particles[i].originalLife = particles[i].life;
    }

    const updateParticles = () => {
      particles.forEach((particle) => {
        // Mouse interaction
        if (interactive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx += (dx / distance) * force * 0.02;
            particle.vy += (dy / distance) * force * 0.02;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.8;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.8;

        // Respawn dead particles
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = particle.originalLife;
        }

        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        const alpha = particle.life / particle.originalLife;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = alpha * 0.6;
        ctx.fill();

        // Draw connections to nearby particles
        particles.forEach((otherParticle) => {
          if (particle !== otherParticle) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = particle.color;
              ctx.globalAlpha = (80 - distance) / 80 * alpha * 0.3;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    resizeCanvas();
    animate();

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [particleCount, colors, interactive]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

export default AdvancedParticleSystem;
