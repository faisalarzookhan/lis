'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
}

interface AutoPlayCarouselProps {
  testimonials: Testimonial[];
  autoPlayInterval?: number;
  className?: string;
}

const AutoPlayCarousel: React.FC<AutoPlayCarouselProps> = ({
  testimonials,
  autoPlayInterval = 5000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isPlaying, isHovered, testimonials.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (testimonials.length === 0) return null;

  return (
    <div
      className={`relative max-w-4xl mx-auto ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Testimonial Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Quote Icon */}
            <div className="text-6xl text-accent/20 mb-6">"</div>

            {/* Testimonial Content */}
            <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic leading-relaxed mb-8">
              {testimonials[currentIndex].content}
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                {testimonials[currentIndex].image ? (
                  <LazyImage
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-4 border-accent/20"
                  />
                ) : (
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonials[currentIndex].name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-lg">{testimonials[currentIndex].name}</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={goToPrevious}
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-accent'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Play/Pause Control */}
        <div className="absolute top-4 right-4">
          <button
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            ) : (
              <Play className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className="bg-accent h-2 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: isPlaying && !isHovered ? '100%' : `${((currentIndex + 1) / testimonials.length) * 100}%` }}
          transition={{
            duration: isPlaying && !isHovered ? autoPlayInterval / 1000 : 0.3,
            ease: 'linear'
          }}
        />
      </div>

      {/* Counter */}
      <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
        {currentIndex + 1} of {testimonials.length}
      </div>
    </div>
  );
};

export default AutoPlayCarousel;
