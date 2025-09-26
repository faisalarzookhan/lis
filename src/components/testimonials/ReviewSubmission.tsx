'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

interface ReviewSubmissionProps {
  onSubmit: (data: ReviewData) => Promise<void>;
  className?: string;
}

interface ReviewData {
  name: string;
  company: string;
  role: string;
  rating: number;
  content: string;
  industry: string;
  service: string;
  attachments?: File[];
  projectSnippet?: File;
}

const ReviewSubmission: React.FC<ReviewSubmissionProps> = ({ onSubmit, className = '' }) => {
  const [formData, setFormData] = useState<ReviewData>({
    name: '',
    company: '',
    role: '',
    rating: 5,
    content: '',
    industry: '',
    service: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [projectSnippet, setProjectSnippet] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ReviewData>>({});

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education',
    'Manufacturing', 'Real Estate', 'Retail', 'Media', 'Other'
  ];

  const services = [
    'Web Development', 'Mobile App Development', 'AI/ML Solutions',
    'Cloud Services', 'Digital Transformation', 'UI/UX Design',
    'Consulting', 'Maintenance & Support', 'Other'
  ];

  const handleInputChange = (field: keyof ReviewData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (files: FileList | null, type: 'attachments' | 'projectSnippet') => {
    if (!files) return;

    if (type === 'attachments') {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
    } else {
      setProjectSnippet(files[0]);
    }
  };

  const removeFile = (index: number, type: 'attachments' | 'projectSnippet') => {
    if (type === 'attachments') {
      setAttachments(prev => prev.filter((_, i) => i !== index));
    } else {
      setProjectSnippet(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ReviewData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.content.trim()) newErrors.content = 'Review content is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.service) newErrors.service = 'Service is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        attachments,
        projectSnippet: projectSnippet || undefined
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={interactive ? () => handleInputChange('rating', i + 1) : undefined}
        className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </button>
    ));
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
          Thank You for Your Review!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your testimonial has been submitted and will be reviewed before publication.
          We appreciate your feedback!
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Share Your Experience</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Help others by sharing your project experience with us
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-accent focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company *</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-accent focus:border-transparent ${
                errors.company ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Company name"
            />
            {errors.company && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.company}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Role</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="e.g., CEO, CTO, Project Manager"
          />
        </div>

        {/* Industry and Service */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Industry *</label>
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-accent focus:border-transparent ${
                errors.industry ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            {errors.industry && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.industry}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Service Used *</label>
            <select
              value={formData.service}
              onChange={(e) => handleInputChange('service', e.target.value)}
              className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-accent focus:border-transparent ${
                errors.service ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Service</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
            {errors.service && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.service}
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">Rating *</label>
          <div className="flex items-center space-x-2">
            {renderStars(formData.rating, true)}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {formData.rating} out of 5 stars
            </span>
          </div>
        </div>

        {/* Review Content */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Review *</label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            rows={6}
            className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-accent focus:border-transparent ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Share your experience working with us. What did you like? What results did you achieve?"
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.content}
            </p>
          )}
        </div>

        {/* File Uploads */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Snippet (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload(e.target.files, 'projectSnippet')}
                className="hidden"
                id="projectSnippet"
              />
              <label htmlFor="projectSnippet" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Upload a screenshot or video of your project
                </span>
              </label>
              {projectSnippet && (
                <div className="mt-2 flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  <span className="text-sm">{projectSnippet.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(0, 'projectSnippet')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Attachments (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files, 'attachments')}
                className="hidden"
                id="attachments"
              />
              <label htmlFor="attachments" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Upload additional images (max 5)
                </span>
              </label>
              {attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index, 'attachments')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewSubmission;
