import React from 'react';
import { Play, CheckCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedCounters from './AnimatedCounters';
import ParallaxSection from './ParallaxSection';
import InteractiveParticleBackground from './InteractiveParticleBackground';
import AdvancedParticleSystem from './AdvancedParticleSystem';
import FloatingElements from './FloatingElements';
import MagneticButton from '../ui/MagneticButton';

const HeroSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const stats = [
    { number: '120+', label: 'Projects Delivered', description: 'Global businesses transformed' },
    { number: '28K', label: 'Active Users', description: 'Trusted platforms powering operations' },
    { number: '98%', label: 'Client Retention', description: 'Long-term partners, not one-time clients' },
  ];

  const highlights = [
    'Enterprise-grade security & compliance',
    'Scalable solutions that grow with you',
    'Expert team with 15+ years experience',
    'Royal client experience guarantee'
  ];

  return (
    <ParallaxSection className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-bg to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      {/* Advanced Particle System */}
      <AdvancedParticleSystem
        particleCount={50}
        className="absolute inset-0"
        interactive={true}
      />

      {/* Floating Elements */}
      <FloatingElements
        count={8}
        className="absolute inset-0"
        size="lg"
      />

      {/* Interactive Particle Background (legacy) */}
      <InteractiveParticleBackground
        particleCount={20}
        className="absolute inset-0"
      />

      {/* Enhanced Floating Elements with Parallax */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-accent/10 rounded-full animate-float"
        style={{ y: y1 }}
      ></motion.div>
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 bg-accent/20 rounded-full animate-float"
        style={{ y: y2, animationDelay: '1s' }}
      ></motion.div>
      <motion.div
        className="absolute bottom-40 left-20 w-12 h-12 bg-accent/15 rounded-full animate-float"
        style={{ y: y3, animationDelay: '2s' }}
      ></motion.div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Trusted by 120+ Global Businesses
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              <span className="gradient-text">
                Limitless
              </span>
              <br />
              Infotech Solution
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-accent font-semibold mb-4"
            >
              Where Innovation Meets Execution
            </motion.p>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            >
              Professional. Scalable. Data-driven.
            </motion.p>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8"
            >
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <MagneticButton
                href="/contact"
                variant="primary"
                size="lg"
                magneticStrength={0.2}
              >
                Get Started
              </MagneticButton>
              <MagneticButton
                variant="outline"
                size="lg"
                magneticStrength={0.2}
                onClick={() => {
                  // Handle demo video play - TODO: Implement video modal
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </MagneticButton>
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              Start your digital transformation journey today.
            </motion.p>
          </motion.div>

          {/* Visual/Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Visual Card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-accent to-accent-dark rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-accent font-bold text-xl">L</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Architects of Transformation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  At Limitless, we don't just build software—we redefine digital identities. 
                  From concept to code, every solution is crafted with precision, creativity, 
                  and a focus on future growth.
                </p>
              </div>
            </div>

            {/* Animated Counters */}
            <AnimatedCounters
              counters={stats.map(stat => ({
                value: parseInt(stat.number.replace(/[^0-9]/g, '')),
                label: stat.label,
                suffix: stat.number.includes('+') ? '+' : stat.number.includes('K') ? 'K' : stat.number.includes('%') ? '%' : '',
                duration: 2000
              }))}
              className="grid grid-cols-3 gap-4"
            />
          </motion.div>
        </div>
      </div>
    </ParallaxSection>
  );
};

export default HeroSection;
