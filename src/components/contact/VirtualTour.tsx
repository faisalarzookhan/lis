'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Eye, Navigation } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

interface VirtualTourProps {
  className?: string;
}

const VirtualTourProps: React.FC<VirtualTourProps> = ({ className = '' }) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const locations = [
    {
      id: 'mumbai-office',
      name: 'Mumbai Headquarters',
      address: '123 Business Park, Mumbai, Maharashtra, India',
      description: 'Our main office featuring modern workspaces, collaboration areas, and state-of-the-art technology labs.',
      image: '/images/office-mumbai.jpg',
      virtualTourUrl: 'https://example.com/virtual-tour-mumbai',
      mapUrl: 'https://maps.google.com/?q=123+Business+Park+Mumbai+India'
    },
    {
      id: 'delhi-office',
      name: 'Delhi Branch Office',
      address: '456 Tech Hub, Connaught Place, Delhi, India',
      description: 'Strategic location in the heart of Delhi, perfect for client meetings and team collaborations.',
      image: '/images/office-delhi.jpg',
      virtualTourUrl: 'https://example.com/virtual-tour-delhi',
      mapUrl: 'https://maps.google.com/?q=456+Tech+Hub+Delhi+India'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Visit Our Offices</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Take a virtual tour of our offices or find us on the map
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="relative">
              <LazyImage
                src={location.image}
                alt={location.name}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                  {location.name}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{location.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{location.address}</p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                {location.description}
              </p>

              <div className="flex space-x-3">
                <motion.a
                  href={location.virtualTourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Virtual Tour</span>
                </motion.a>

                <motion.a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Embedded Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h4 className="text-lg font-bold mb-4 flex items-center">
          <MapPin className="w-5 h-5 text-accent mr-2" />
          Find Us on the Map
        </h4>
        <div className="aspect-video rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160982328!2d72.74109995473154!3d19.08250200331395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sus!4v1678886472481!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default VirtualTourProps;
