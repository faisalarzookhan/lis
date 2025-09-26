'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

interface VideoTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  videoUrl: string;
  posterUrl: string;
  duration: string;
  transcript?: string;
}

interface VideoTestimonialsProps {
  testimonials: VideoTestimonial[];
  className?: string;
}

const VideoTestimonials: React.FC<VideoTestimonialsProps> = ({ testimonials, className = '' }) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  const togglePlay = (videoId: string) => {
    setPlayingVideo(playingVideo === videoId ? null : videoId);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          {/* Video Container */}
          <div className="relative aspect-video bg-gray-900">
            {playingVideo === testimonial.id ? (
              <video
                src={testimonial.videoUrl}
                poster={testimonial.posterUrl}
                autoPlay
                muted={muted}
                loop
                className="w-full h-full object-cover"
                onEnded={() => setPlayingVideo(null)}
              />
            ) : (
              <LazyImage
                src={testimonial.posterUrl}
                alt={`${testimonial.name} testimonial`}
                width={400}
                height={225}
                className="w-full h-full object-cover"
              />
            )}

            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                onClick={() => togglePlay(testimonial.id)}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {playingVideo === testimonial.id ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </motion.button>
            </div>

            {/* Video Controls */}
            {playingVideo === testimonial.id && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={toggleMute}
                  className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  {muted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            )}

            {/* Duration Badge */}
            <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
              {testimonial.duration}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{testimonial.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>

            {testimonial.transcript && (
              <div className="mt-4">
                <details className="group">
                  <summary className="cursor-pointer text-sm text-accent hover:text-accent-dark font-medium">
                    View Transcript
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {testimonial.transcript}
                  </p>
                </details>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VideoTestimonials;
