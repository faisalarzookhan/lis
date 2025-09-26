'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Search, Download, CheckSquare, Square, Trash2, Edit, Star, Eye, EyeOff, Filter } from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  content: string;
  rating: number;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const TestimonialsManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTestimonials, setSelectedTestimonials] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [filterRating, setFilterRating] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonials(data.testimonials || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'published' && testimonial.is_published) ||
      (filterStatus === 'draft' && !testimonial.is_published);
    const matchesRating = filterRating === 'all' || testimonial.rating.toString() === filterRating;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const handleSelectAll = () => {
    if (selectedTestimonials.size === filteredTestimonials.length) {
      setSelectedTestimonials(new Set());
    } else {
      setSelectedTestimonials(new Set(filteredTestimonials.map(t => t.id)));
    }
  };

  const handleSelectTestimonial = (testimonialId: string) => {
    const newSelected = new Set(selectedTestimonials);
    if (newSelected.has(testimonialId)) {
      newSelected.delete(testimonialId);
    } else {
      newSelected.add(testimonialId);
    }
    setSelectedTestimonials(newSelected);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedTestimonials.size} selected testimonials?`)) return;

    try {
      const response = await fetch('/api/testimonials/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedTestimonials) }),
      });
      if (!response.ok) throw new Error('Failed to delete testimonials');

      setTestimonials(testimonials.filter(t => !selectedTestimonials.has(t.id)));
      setSelectedTestimonials(new Set());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete testimonials');
    }
  };

  const handleBulkPublish = async (publish: boolean) => {
    try {
      const response = await fetch('/api/testimonials/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: Array.from(selectedTestimonials),
          action: 'publish',
          value: publish
        }),
      });
      if (!response.ok) throw new Error('Failed to update testimonials');

      setTestimonials(testimonials.map(t =>
        selectedTestimonials.has(t.id) ? { ...t, is_published: publish } : t
      ));
      setSelectedTestimonials(new Set());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update testimonials');
    }
  };

  const handleBulkFeature = async (feature: boolean) => {
    try {
      const response = await fetch('/api/testimonials/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: Array.from(selectedTestimonials),
          action: 'feature',
          value: feature
        }),
      });
      if (!response.ok) throw new Error('Failed to update testimonials');

      setTestimonials(testimonials.map(t =>
        selectedTestimonials.has(t.id) ? { ...t, is_featured: feature } : t
      ));
      setSelectedTestimonials(new Set());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update testimonials');
    }
  };

  const handleEdit = (testimonialId: string) => {
    router.push(`/admin/testimonials/${testimonialId}/edit`);
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const response = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete testimonial');
      setTestimonials(testimonials.filter(t => t.id !== testimonialId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete testimonial');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Client Name', 'Company', 'Rating', 'Content', 'Status', 'Featured', 'Created'],
      ...filteredTestimonials.map(t => [
        t.client_name,
        t.company,
        t.rating.toString(),
        `"${t.content.replace(/"/g, '""')}"`,
        t.is_published ? 'Published' : 'Draft',
        t.is_featured ? 'Yes' : 'No',
        new Date(t.created_at).toLocaleDateString(),
      ])
    ].map(row => row.map(cell => cell).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testimonials-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Testimonials Management</h1>
        <button
          onClick={() => router.push('/admin/testimonials/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Testimonial
        </button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-col md:flex-row gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value as any)}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedTestimonials.size > 0 && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedTestimonials.size} testimonial{selectedTestimonials.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkPublish(true)}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkPublish(false)}
                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
              >
                Unpublish
              </button>
              <button
                onClick={() => handleBulkFeature(true)}
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
              >
                Feature
              </button>
              <button
                onClick={() => handleBulkFeature(false)}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
              >
                Unfeature
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Testimonials List */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <button
            onClick={handleSelectAll}
            className="text-gray-600 dark:text-gray-300"
            aria-label="Select all testimonials"
          >
            {selectedTestimonials.size === filteredTestimonials.length && filteredTestimonials.length > 0 ? (
              <CheckSquare className="w-5 h-5" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>
          <span className="flex-1 font-medium">Client & Company</span>
          <span className="w-24 text-center">Rating</span>
          <span className="w-20 text-center">Status</span>
          <span className="w-20 text-center">Featured</span>
          <span className="w-32 text-center">Created</span>
          <span className="w-24">Actions</span>
        </div>

        {/* Testimonials */}
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="p-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => handleSelectTestimonial(testimonial.id)}
                className="text-gray-600 dark:text-gray-300 mt-1"
                aria-label={`Select testimonial from ${testimonial.client_name}`}
              >
                {selectedTestimonials.has(testimonial.id) ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{testimonial.client_name}</h3>
                  <span className="text-gray-500">from</span>
                  <span className="font-medium text-blue-600">{testimonial.company}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(testimonial.rating)}
                  <span className="text-sm text-gray-500 ml-2">({testimonial.rating}/5)</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Created: {new Date(testimonial.created_at).toLocaleDateString()}</span>
                  <span>Updated: {new Date(testimonial.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="w-24 flex items-center justify-center">
                <div className="flex items-center gap-1">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <div className="w-20 text-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  testimonial.is_published
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {testimonial.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="w-20 text-center">
                {testimonial.is_featured ? (
                  <Eye className="w-5 h-5 text-purple-500 mx-auto" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400 mx-auto" />
                )}
              </div>
              <div className="w-32 text-center text-sm">
                {new Date(testimonial.created_at).toLocaleDateString()}
              </div>
              <div className="w-24 flex gap-2">
                <button
                  onClick={() => handleEdit(testimonial.id)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  aria-label="Edit testimonial"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                  aria-label="Delete testimonial"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {filteredTestimonials.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No testimonials found matching your criteria.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManagement;
