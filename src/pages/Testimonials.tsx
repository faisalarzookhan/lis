import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Testimonial } from '../types';
import Card from '../components/ui/Card';
import StarRating from '../components/ui/StarRating';
import { useForm } from 'react-hook-form';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import LazyImage from '../components/ui/LazyImage';
import VideoTestimonials from '../components/testimonials/VideoTestimonials';
import AutoPlayCarousel from '../components/testimonials/AutoPlayCarousel';
import IndustryServiceFilters from '../components/testimonials/IndustryServiceFilters';
import ReviewSubmission from '../components/testimonials/ReviewSubmission';

type ReviewFormData = {
  name: string;
  company: string;
  role: string;
  rating: number;
  content: string;
};

const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset } = useForm<ReviewFormData>();

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('id');
      
      if (error) {
        setError(error.message);
        console.error('Error fetching testimonials:', error);
      } else if (data) {
        setReviews(data as Testimonial[]);
      }
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  const onSubmit = async (data: ReviewFormData) => {
    const { error } = await supabase.from('testimonials').insert([
      { ...data, approved: false } // New testimonials are not approved by default
    ]);

    if (error) {
      alert('Error submitting review: ' + error.message);
    } else {
      setSubmitted(true);
      reset();
    }
  };

  // Mock video testimonials data (replace with actual data from API)
  const videoTestimonials = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'CTO',
      company: 'TechCorp',
      videoUrl: '/videos/testimonial-sarah.mp4',
      posterUrl: '/images/testimonial-sarah.jpg',
      duration: '2:15',
      transcript: 'Working with Limitless has been transformative for our business...'
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'CEO',
      company: 'InnovateLabs',
      videoUrl: '/videos/testimonial-michael.mp4',
      posterUrl: '/images/testimonial-michael.jpg',
      duration: '1:45',
      transcript: 'The AI solutions provided exceeded our expectations...'
    }
  ];

  // Enhanced testimonials with industry and service data
  const enhancedReviews = reviews.map(review => ({
    ...review,
    industry: review.industry || 'Technology',
    service: review.service || 'Web Development',
    featured: review.rating >= 5
  }));

  const [filteredReviews, setFilteredReviews] = useState(enhancedReviews);

  useEffect(() => {
    setFilteredReviews(enhancedReviews);
  }, [reviews]);

  return (
    <div className="pt-20">
      <header className="section-padding bg-gray-bg dark:bg-gray-900/50 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Client Testimonials</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          See what our clients say about working with us. Their success is our success.
        </p>
      </header>

      {/* Video Testimonials Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Video Testimonials</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Hear directly from our clients about their experience
            </p>
          </div>
          <VideoTestimonials testimonials={videoTestimonials} />
        </div>
      </section>

      {/* Auto-play Carousel */}
      <section className="section-padding bg-gray-bg dark:bg-gray-900/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real feedback from real projects
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <SkeletonLoader width="200px" height="200px" rounded />
            </div>
          ) : error ? <div className="text-center text-red-500">Error: {error}</div> : (
            <AutoPlayCarousel testimonials={filteredReviews} />
          )}
        </div>
      </section>

      {/* Filters and Text Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">All Testimonials</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Browse through all our client reviews
            </p>
          </div>

          {/* Filters */}
          <IndustryServiceFilters
            testimonials={enhancedReviews}
            onFilteredChange={setFilteredReviews}
            className="mb-8"
          />

          {/* Filtered Testimonials Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="p-8 h-full flex flex-col">
                  <div className="flex items-center space-x-4 mb-4">
                    <SkeletonLoader width="4rem" height="4rem" rounded />
                    <div className="flex-1">
                      <SkeletonLoader width="60%" height="1.5rem" className="mb-2" />
                      <SkeletonLoader width="40%" height="1rem" />
                    </div>
                  </div>
                  <SkeletonLoader width="100%" height="1rem" className="mb-2" />
                  <SkeletonLoader width="90%" height="1rem" className="mb-2" />
                  <SkeletonLoader width="80%" height="1rem" />
                </Card>
              ))}
            </div>
          ) : error ? <div className="text-center text-red-500">Error: {error}</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
              {filteredReviews.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-8 h-full flex flex-col">
                    <div className="flex items-center space-x-4 mb-4">
                      <LazyImage
                        src={testimonial.image || `https://i.pravatar.cc/150?u=${testimonial.id}`}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                            {testimonial.industry}
                          </span>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                            {testimonial.service}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic flex-grow mb-4">"{testimonial.content}"</p>
                    <div className="flex items-center justify-between">
                      <StarRating rating={testimonial.rating} />
                      {testimonial.featured && (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full flex items-center">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Enhanced Review Submission */}
          <ReviewSubmission
            onSubmit={async (data) => {
              const { error } = await supabase.from('testimonials').insert([
                {
                  ...data,
                  approved: false,
                  industry: data.industry,
                  service: data.service,
                  attachments: data.attachments?.map(file => file.name) || [],
                  projectSnippet: data.projectSnippet?.name || null
                }
              ]);

              if (error) {
                alert('Error submitting review: ' + error.message);
              } else {
                setSubmitted(true);
                reset();
              }
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
