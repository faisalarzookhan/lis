'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BarChart2, Zap } from 'lucide-react';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { supabase } from '../../lib/supabaseClient';

interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variant_a_name: string;
  variant_b_name: string;
  variant_a_traffic_split: number; // Percentage
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

const ABTestingManagement: React.FC = () => {
  const [abTests, setAbTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<ABTest | null>(null); // For editing

  useEffect(() => {
    fetchABTests();
  }, []);

  const fetchABTests = async () => {
    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAbTests(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch A/B tests');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTest = async (test: Omit<ABTest, 'id' | 'created_at' | 'updated_at'>, testId?: string) => {
    setError(null);
    try {
      if (testId) {
        // Update existing test
        const { error } = await supabase
          .from('ab_tests')
          