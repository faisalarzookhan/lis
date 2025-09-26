'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  service: z.string().min(1, 'Please select a service'),
  budget: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

interface ServiceRequestFormProps {
  serviceId?: string;
  serviceName?: string;
}

const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ serviceId, serviceName }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      service: serviceName || '',
    },
  });

  const watchedFields = watch();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldStatus = (fieldName: keyof FormData) => {
    const value = watchedFields[fieldName];
    const error = errors[fieldName];
    if (error) return 'error';
    if (value && value.length > 0) return 'success';
    return 'idle';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
    >
      <h3 className="text-2xl font-bold mb-6">Get a Quote for {serviceName || 'Our Services'}</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <div className="relative">
              <input
                {...register('name')}
                type="text"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${
                  getFieldStatus('name') === 'error'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : getFieldStatus('name') === 'success'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Your full name"
              />
              {getFieldStatus('name') === 'success' && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {getFieldStatus('name') === 'error' && (
                <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <div className="relative">
              <input
                {...register('email')}
                type="email"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${
                  getFieldStatus('email') === 'error'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : getFieldStatus('email') === 'success'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="your@email.com"
              />
              {getFieldStatus('email') === 'success' && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {getFieldStatus('email') === 'error' && (
                <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Service *</label>
            <select
              {...register('service')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${
                getFieldStatus('service') === 'error'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : getFieldStatus('service') === 'success'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Select a service</option>
              <option value="web-development">Web Development</option>
              <option value="mobile-apps">Mobile Apps</option>
              <option value="ai-solutions">AI Solutions</option>
              <option value="cloud-services">Cloud Services</option>
              <option value="consulting">Consulting</option>
            </select>
            {errors.service && (
              <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Budget Range *</label>
            <select
              {...register('budget')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${
                getFieldStatus('budget') === 'error'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : getFieldStatus('budget') === 'success'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Select budget range</option>
              <option value="under-10k">Under $10,000</option>
              <option value="10k-25k">$10,000 - $25,000</option>
              <option value="25k-50k">$25,000 - $50,000</option>
              <option value="50k-100k">$50,000 - $100,000</option>
              <option value="over-100k">Over $100,000</option>
            </select>
            {errors.budget && (
              <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preferred Timeline *</label>
          <select
            {...register('timeline')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${
              getFieldStatus('timeline') === 'error'
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : getFieldStatus('timeline') === 'success'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select timeline</option>
            <option value="asap">ASAP</option>
            <option value="1-month">Within 1 month</option>
            <option value="2-3-months">2-3 months</option>
            <option value="3-6-months">3-6 months</option>
            <option value="6-months-plus">6+ months</option>
          </select>
          {errors.timeline && (
            <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Project Details *</label>
          <div className="relative">
            <textarea
              {...register('message')}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${
                getFieldStatus('message') === 'error'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : getFieldStatus('message') === 'success'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Tell us about your project requirements..."
            />
            {getFieldStatus('message') === 'success' && (
              <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
            )}
            {getFieldStatus('message') === 'error' && (
              <XCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
            )}
          </div>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Sending...</span>
            </>
          ) : submitStatus === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Request Sent Successfully!</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Request</span>
            </>
          )}
        </motion.button>

        {submitStatus === 'error' && (
          <p className="text-red-500 text-center">Failed to send request. Please try again.</p>
        )}
      </form>
    </motion.div>
  );
};

export default ServiceRequestForm;
