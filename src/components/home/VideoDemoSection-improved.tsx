'use client';

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, AlertCircle } from 'lucide-react';
import LazyImage from '../ui/LazyImage';
import Card from '../ui/Card';

interface VideoDemo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
}

interface VideoDemoSectionProps {
  className?: string;
}

const VideoDemoSection: React.FC<VideoDemoSectionProps> = ({ className = '' }) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());

  const demoVideos: VideoDemo[] = [
    {
      id: 'ai-platform',
      title: 'AI Platform Demo',
      description: 'See how our AI solutions transform business operations',
      thumbnail: '/images/demo-ai-platform.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Placeholder video
      duration: '2:45',
      category: 'ai'
    },
    {
      id: 'web-development',
      title: 'Web Development Showcase',
      description: 'Modern web applications built with cutting-edge technology',
      thumbnail: '/images/demo-web-dev.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', // Placeholder video
      duration: '3:12',
      category: 'web'
    },
    {
      id: 'mobile-app',
      title: 'Mobile App Demo',
      description: 'Cross-platform mobile solutions for seamless user experience',
      thumbnail: '/images/demo-mobile.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', // Placeholder video
      duration: '2:18',
      category: 'mobile'
    },
    {
      id: 'cloud-migration',
      title: 'Cloud Migration Success',
      description: 'Complete cloud transformation with zero downtime',
      thumbnail: '/images/demo-cloud.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', // Placeholder video
      duration: '4:05',
      category: 'cloud'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Demos' },
    { id: 'ai', label: 'AI Solutions' },
    { id: 'web', label: 'Web Development' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'cloud', label: 'Cloud Services' }
  ];

  const filteredVideos = selectedCategory === 'all'
    ? demoVideos
    : demoVideos.filter(video => video.category === selectedCategory);

  const togglePlay = (videoId: string) => {
    if (videoErrors.has(videoId)) {
      // Don't try to play videos that have errors
      return;
    }
    setPlayingVideo(playingVideo === videoId ? null : videoId);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const handleVideoError = (videoId: string) => {
    setVideoErrors(prev => new Set(prev).add(videoId));
    setPlayingVideo(null);
  };

  const VideoPlayer = ({ video, isPlaying }: { video: VideoDemo; isPlaying: boolean }) => {
    if (videoErrors.has(video.id)) {
      return (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
            <p className="text-sm">Video unavailable</p>
          </div>
        </div>
      );
    }

    if (isPlaying && video.videoUrl) {
      return (
        <video
          src={video.videoUrl}
          poster={video.thumbnail}
          autoPlay
          muted={muted}
          loop
          className="w-full h-full object-cover"
          onEnded={() => setPlayingVideo(null)}
          onError={() => handleVideoError(video.id)}
          onLoadStart={() => {
            // Add loading state if needed
          }}
        />
      );
    }

    return (
      <LazyImage
        src={video.thumbnail}
        alt={video.title}
        width={400}
        height={225}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        fallbackSrc="/images/video-placeholder.jpg"
      />
    );
  };

  return (
    <section className={`py-20 bg-gradient-to-br from-gray-bg to-white dark:from-gray-900 dark:to-gray-800 ${className}`}>
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">See Our Solutions in Action</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Watch real demonstrations of our cutting-edge technology solutions
            and see how they can transform your business operations.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Video Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Video Container */}
              <div className="relative aspect-video bg-gray-900">
                <Suspense fallback={
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                  </div>
                }>
                  <VideoPlayer video={video} isPlaying={playingVideo === video.id} />
                </Suspense>

                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    onClick={() => togglePlay(video.id)}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={videoErrors.has(video.id)}
                  >
                    {playingVideo === video.id ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </motion.button>
                </div>

                {/* Video Controls */}
                {playingVideo === video.id && !videoErrors.has(video.id) && (
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
                    <button className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                      <Maximize className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}

                {/* Duration Badge */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-accent/90 text-white px-2 py-1 rounded text-xs font-medium">
                  {categories.find(cat => cat.id === video.category)?.label || video.category}
                </div>

                {/* Error Indicator */}
                {videoErrors.has(video.id) && (
                  <div className="absolute top-4 right-4 bg-red-500/90 text-white px-2 py-1 rounded text-xs font-medium">
                    Unavailable
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                  {video.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {video.description}
                </p>

                {/* Watch Button */}
                <button
                  onClick={() => togglePlay(video.id)}
                  disabled={videoErrors.has(video.id)}
                  className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    videoErrors.has(video.id)
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-accent text-white hover:bg-accent-dark'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>{videoErrors.has(video.id) ? 'Video Unavailable' : 'Watch Demo'}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to See More?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Schedule a personalized demo to see our solutions tailored to your specific needs.
          </p>
          <button className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors">
            Schedule Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoDemoSection;
