// Advanced animation utilities for professional effects

export const createFloatingElements = (count: number = 5) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
    delay: Math.random() * 2,
  }));
};

export const applyMagneticEffect = (
  element: HTMLElement,
  mouseX: number,
  mouseY: number,
  strength: number = 0.3
) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const deltaX = mouseX - centerX;
  const deltaY = mouseY - centerY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance < 100) {
    const force = (100 - distance) / 100;
    const moveX = deltaX * force * strength;
    const moveY = deltaY * force * strength;

    element.style.transform = `translate(${moveX}px, ${moveY}px)`;
  } else {
    element.style.transform = 'translate(0px, 0px)';
  }
};

export const generateHolographicColors = () => {
  const colors = ['#00D4FF', '#FF0080', '#00FF88', '#FFAA00', '#AA00FF'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const createMorphingPath = (progress: number) => {
  const paths = [
    'M0,50 Q25,0 50,50 T100,50 Q75,100 50,50 T0,50',
    'M0,50 Q50,0 100,50 Q50,100 0,50',
    'M0,50 L25,25 L50,75 L75,25 L100,50 L75,75 L50,25 L25,75 L0,50',
  ];

  const pathIndex = Math.floor(progress * (paths.length - 1));
  return paths[pathIndex]; // Simplified - in real implementation, interpolate between paths
};

export const createScrollTrigger = (
  element: HTMLElement,
  callback: (progress: number) => void
) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const progress = entry.intersectionRatio;
        callback(progress);
      });
    },
    {
      threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      rootMargin: '0px',
    }
  );

  observer.observe(element);
  return () => observer.disconnect();
};

export const applyGlassmorphism = (element: HTMLElement, intensity: number = 0.1) => {
  element.style.backdropFilter = `blur(${intensity * 10}px)`;
  element.style.backgroundColor = `rgba(255, 255, 255, ${intensity})`;
  element.style.border = `1px solid rgba(255, 255, 255, ${intensity * 0.5})`;
};

export const createParticleSystem = (canvas: HTMLCanvasElement, particleCount: number = 100) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
  }> = [];

  const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: Math.random() * 100 + 50,
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;

      if (particle.life <= 0) {
        particles.splice(index, 1);
        return;
      }

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.life / 150;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  };

  animate();
  return particles;
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};
