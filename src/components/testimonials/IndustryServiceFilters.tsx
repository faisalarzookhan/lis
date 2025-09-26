'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  industry: string;
  service: string;
  featured?: boolean;
}

interface IndustryServiceFiltersProps {
  testimonials: Testimonial[];
  onFilteredChange: (filtered: Testimonial[]) => void;
  className?: string;
}

const IndustryServiceFilters: React.FC<IndustryServiceFiltersProps> = ({
  testimonials,
  onFilteredChange,
  className = ''
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [showFeatured, setShowFeatured] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Extract unique industries and services
  const industries = Array.from(new Set(testimonials.map(t => t.industry)));
  const services = Array.from(new Set(testimonials.map(t => t.service)));

  // Filter testimonials based on selections
  React.useEffect(() => {
    let filtered = testimonials;

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(t => t.industry === selectedIndustry);
    }

    if (selectedService !== 'all') {
      filtered = filtered.filter(t => t.service === selectedService);
    }

    if (showFeatured) {
      filtered = filtered.filter(t => t.featured);
    }

    onFilteredChange(filtered);
  }, [selectedIndustry, selectedService, showFeatured, testimonials, onFilteredChange]);

  const clearFilters = () => {
    setSelectedIndustry('all');
    setSelectedService('all');
    setShowFeatured(false);
  };

  const hasActiveFilters = selectedIndustry !== 'all' || selectedService !== 'all' || showFeatured;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}>
      {/* Filter Toggle Button (Mobile) */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center space-x-2 w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Filter Content */}
      <motion.div
        initial={false}
        animate={{ height: isFilterOpen || window.innerWidth >= 768 ? 'auto' : 0 }}
        className="overflow-hidden md:overflow-visible md:h-auto"
      >
        <div className="grid md:grid-cols-4 gap-4 items-end">
          {/* Industry Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Service</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Services</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          {/* Featured Toggle */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFeatured}
                onChange={(e) => setShowFeatured(e.target.checked)}
                className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
              />
              <span className="text-sm font-medium flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                Featured Only
              </span>
            </label>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div>
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
          >
            {selectedIndustry !== 'all' && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                <span>Industry: {selectedIndustry}</span>
                <button onClick={() => setSelectedIndustry('all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedService !== 'all' && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                <span>Service: {selectedService}</span>
                <button onClick={() => setSelectedService('all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {showFeatured && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm">
                <Star className="w-3 h-3" />
                <span>Featured</span>
                <button onClick={() => setShowFeatured(false)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default IndustryServiceFilters;
