'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

interface ClientTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
  projectId: string;
}

interface ClientTestimonialIntegrationProps {
  testimonials: ClientTestimonial[];
  projectId: string;
}

const ClientTestimonialIntegration: React.FC<ClientTestimonialIntegrationProps> = ({
  testimonials,
  projectId
}) => {
  const relevantTestimonials = testimonials.filter(t => t.projectId === projectId);

  if (relevantTestimonials.length === 0) {
    return null;
  }

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
      <h3 className="text-xl font-bold">Client Feedback</h3>

      <div className="grid gap-6">
        {relevantTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-start space-x-4">
              <div className="relative">
                <Quote className="w-8 h-8 text-blue-300 absolute -top-2 -left-2" />
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {testimonial.image ? (
                    <LazyImage
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <div className="flex items-center">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {testimonial.role} at {testimonial.company}
                </p>

                <blockquote className="text-gray-800 dark:text-gray-200 italic text-lg leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Project Testimonial
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(testimonial.rating)}
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        {testimonial.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {relevantTestimonials.length > 1 && (
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400">
            Multiple clients have shared their positive experiences with this project
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientTestimonialIntegration;
