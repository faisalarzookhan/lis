'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

interface ServiceTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
  service: string;
}

interface ServiceTestimonialsProps {
  testimonials: ServiceTestimonial[];
  serviceId?: string;
}

const ServiceTestimonials: React.FC<ServiceTestimonialsProps> = ({ testimonials, serviceId }) => {
  const filteredTestimonials = serviceId
    ? testimonials.filter(t => t.service.toLowerCase().includes(serviceId.toLowerCase()))
    : testimonials;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">What Clients Say About Our {serviceId ? serviceId : 'Services'}</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative"
          >
            <Quote className="w-8 h-8 text-accent/20 absolute top-4 right-4" />

            <div className="flex items-center space-x-4 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {testimonial.image ? (
                  <LazyImage
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>

            <div className="flex items-center mb-4">
              {renderStars(testimonial.rating)}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                ({testimonial.rating}/5)
              </span>
            </div>

            <blockquote className="text-gray-700 dark:text-gray-200 italic">
              "{testimonial.content}"
            </blockquote>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                {testimonial.service}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No testimonials available for this service yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceTestimonials;
