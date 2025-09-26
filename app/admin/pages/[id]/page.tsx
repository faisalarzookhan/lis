'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '../../../../src/components/ui/Card';
import LoadingSpinner from '../../../../src/components/ui/LoadingSpinner';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface Page {
  id: string;
  page_name: string;
  content: any;
  is_published: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

const EditPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    page_name: '',
    content: '',
    is_published: false
  });

  useEffect(() => {
    if (params.id) {
      fetchPage();
    }
  }, [params.id]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/pages/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch page');
      const data = await response.json();
      setPage(data.page);
      setFormData({
        page_name: data.page.page_name,
        content: typeof data.page.content === 'string' ? data.page.content : JSON.stringify(data.page.content, null, 2),
        is_published: data.page.is_published
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch page');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/pages/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update page');

      router.push('/admin/pages');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update page');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!page) return <div className="text-gray-500 p-4">Page not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/admin/pages')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Pages</span>
          </button>
          <h1 className="text-3xl font-bold">Edit Page</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFormData(prev => ({ ...prev, is_published: !prev.is_published }))}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                formData.is_published
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}
            >
              {formData.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{formData.is_published ? 'Published' : 'Draft'}</span>
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Name
              </label>
              <input
                type="text"
                value={formData.page_name}
                onChange={(e) => setFormData(prev => ({ ...prev, page_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter page name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content (JSON)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white font-mono text-sm"
                placeholder="Enter page content as JSON"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Page Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Version:</span>
              <span className="ml-2">{page.version}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Created:</span>
              <span className="ml-2">{new Date(page.created_at).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Last Updated:</span>
              <span className="ml-2">{new Date(page.updated_at).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                page.is_published
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {page.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EditPage;
