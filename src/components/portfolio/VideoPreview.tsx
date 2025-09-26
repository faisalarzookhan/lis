'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPreviewProps {
  src: string;
  poster?: string;
  title: string;
  description?: string;
  className?: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  src,
  poster,
  title,
  description,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        loop
        playsInline
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Play Button */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: isPlaying ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={togglePlay}
          className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-4 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Play className="w-8 h-8 ml-1" />
        </motion.button>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 flex items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: showControls || isPlaying ? 1 : 0,
          y: showControls || isPlaying ? 0 : 10
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlay}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleMute}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {isPlaying ? 'Playing' : 'Preview'}
        </div>
      </motion.div>

      {/* Title Overlay */}
      <div className="absolute top-4 left-4 right-4">
        <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">{title}</h3>
        {description && (
          <p className="text-white/90 text-sm drop-shadow-lg">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default VideoPreview;
