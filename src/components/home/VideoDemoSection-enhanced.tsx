'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, X, ExternalLink } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

interface VideoDemo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  fallbackContent?: string;
}

interface VideoDemoSectionProps {
  className?: string;
}

const VideoDemoSection: React.FC<VideoDemoSectionProps> = ({ className = '' }) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoDemo | null>(null);

  const demoVideos: VideoDemo[] = [
    {
      id: 'ai-platform',
      title: 'AI Platform Demo',
      description: 'See how our AI solutions transform business operations with intelligent automation and predictive analytics',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', // Placeholder video
      duration: '2:45',
      category: 'ai',
      fallbackContent: 'Experience our AI platform that automates workflows, provides intelligent insights, and scales with your business needs.'
    },
    {
      id: 'web-development',
      title: 'Web Development Showcase',
      description: 'Modern web applications built with cutting-edge technology stacks and responsive design principles',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', // Placeholder video
      duration: '3:12',
      category: 'web',
      fallbackContent: 'From concept to deployment, we create stunning web experiences that engage users and drive conversions.'
    },
    {
      id: 'mobile-app',
      title: 'Mobile App Demo',
      description: 'Cross-platform mobile solutions for seamless user experience across iOS and Android devices',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4', // Placeholder video
      duration: '2:18',
      category: 'mobile',
      fallbackContent: 'Native and cross-platform mobile apps that deliver exceptional user experiences and business value.'
    },
    {
      id: 'cloud-migration',
      title: 'Cloud Migration Success',
      description: 'Complete cloud transformation with zero downtime and enhanced scalability',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4', // Placeholder video
      duration: '4:05',
      category: 'cloud',
      fallbackContent: 'Seamless cloud migration services that ensure business continuity and improved performance.'
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
    setPlayingVideo(playingVideo === videoId ? null : videoId);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const openModal = (video: VideoDemo) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
    setPlayingVideo(null);
  };

  return (
    <>
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
                  {playingVideo === video.id && video.videoUrl ? (
                    <video
                      src={video.videoUrl}
                      poster={video.thumbnail}
                      autoPlay
                      muted={muted}
                      loop
                      className="w-full h-full object-cover"
                      onEnded={() => setPlayingVideo(null)}
                      onError={() => setPlayingVideo(null)}
                    />
                  ) : (
                    <LazyImage
                      src={video.thumbnail}
                      alt={video.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Play/Pause Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      onClick={() => video.videoUrl ? togglePlay(video.id) : openModal(video)}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {playingVideo === video.id ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </motion.button>
                  </div>

                  {/* Video Controls */}
                  {playingVideo === video.id && (
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
                      <button
                        onClick={() => openModal(video)}
                        className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
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
                    onClick={() => video.videoUrl ? togglePlay(video.id) : openModal(video)}
                    className="mt-4 w-full bg-accent text-white py-2 px-4 rounded-lg font-medium hover:bg-accent-dark transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Watch Demo</span>
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

      {/* Video Modal */}
      <AnimatePresence>
        {showModal && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedVideo.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedVideo.description}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {selectedVideo.videoUrl ? (
                  <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                    <video
                      src={selectedVideo.videoUrl}
                      poster={selectedVideo.thumbnail}
                      controls
                      className="w-full h-full object-cover"
                      autoPlay
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-accent mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {selectedVideo.fallbackContent}
                      </p>
                      <button className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors inline-flex items-center space-x-2">
                        <ExternalLink className="w-4 h-4" />
                        <span>Request Full Demo</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Duration: {selectedVideo.duration}</span>
                  <span>Category: {categories.find(cat => cat.id === selectedVideo.category)?.label}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoDemoSection;
