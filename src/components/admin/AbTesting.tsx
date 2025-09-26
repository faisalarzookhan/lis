'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Plus, Edit, Trash2, BarChart3 } from 'lucide-react';

interface AbTest {
  id: string;
  name: string;
  description: string;
  page_url: string;
  variants: Array<{
    id: string;
    name: string;
    content: any;
    traffic_percentage: number;
  }>;
  status: 'active' | 'paused' | 'completed';
  start_date: string;
  end_date?: string;
  created_at: string;
}

const AbTesting: React.FC = () => {
  const [tests, setTests] = useState<AbTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTest, setSelectedTest] = useState<AbTest | null>(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching A/B tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTest = async (testData: Partial<AbTest>) => {
    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .insert([testData])
        .select()
        .single();

      if (error) throw error;
      setTests([data, ...tests]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating A/B test:', error);
    }
  };

  const updateTestStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('ab_tests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setTests(tests.map(test =>
        test.id === id ? { ...test, status: status as any } : test
      ));
    } catch (error) {
      console.error('Error updating test status:', error);
    }
  };

  const deleteTest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this A/B test?')) return;

    try {
      const { error } = await supabase
        .from('ab_tests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTests(tests.filter(test => test.id !== id));
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">A/B Testing</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          <span>Create Test</span>
        </button>
      </div>

      {showCreateForm && (
        <CreateTestForm
          onSubmit={createTest}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="grid gap-4">
        {tests.map(test => (
          <Card key={test.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{test.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{test.description}</p>
                <p className="text-sm text-gray-500 mt-2">Page: {test.page_url}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    test.status === 'active' ? 'bg-green-100 text-green-800' :
                    test.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {test.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Started: {new Date(test.start_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedTest(test)}
                  className="p-2 text-gray-500 hover:text-blue-500"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateTestStatus(test.id, test.status === 'active' ? 'paused' : 'active')}
                  className="p-2 text-gray-500 hover:text-yellow-500"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTest(test.id)}
                  className="p-2 text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedTest && (
        <TestResultsModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
        />
      )}
    </div>
  );
};

const CreateTestForm: React.FC<{
  onSubmit: (data: Partial<AbTest>) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    page_url: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'active',
      start_date: new Date().toISOString(),
      variants: [
        { id: '1', name: 'Control', content: {}, traffic_percentage: 50 },
        { id: '2', name: 'Variant A', content: {}, traffic_percentage: 50 },
      ],
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Create A/B Test</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Page URL</label>
          <input
            type="url"
            value={formData.page_url}
            onChange={(e) => setFormData({ ...formData, page_url: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Test
          </button>
        </div>
      </form>
    </Card>
  );
};

const TestResultsModal: React.FC<{
  test: AbTest;
  onClose: () => void;
}> = ({ test, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Test Results: {test.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="space-y-4">
          {test.variants.map(variant => (
            <div key={variant.id} className="border rounded-lg p-4">
              <h4 className="font-medium">{variant.name}</h4>
              <p className="text-sm text-gray-500">Traffic: {variant.traffic_percentage}%</p>
              <div className="mt-2">
                <p className="text-sm">Views: 0 | Conversions: 0 | Conversion Rate: 0%</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-gray-500">
          Results will be displayed here once the test has collected data.
        </div>
      </Card>
    </div>
  );
};

export default AbTesting;
