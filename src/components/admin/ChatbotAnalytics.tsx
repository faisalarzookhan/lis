'use client';

import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { MessageSquare, Users, TrendingUp, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ChatbotStats {
  totalConversations: number;
  totalMessages: number;
  averageSessionDuration: number;
  topQueries: Array<{ query: string; count: number }>;
  userSatisfaction: number;
  dailyStats: Array<{ date: string; conversations: number; messages: number }>;
}

const ChatbotAnalytics: React.FC = () => {
  const [stats, setStats] = useState<ChatbotStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/chatbot?range=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setStats(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chatbot Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Conversations</p>
              <p className="text-3xl font-bold">{stats.totalConversations}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Messages</p>
              <p className="text-3xl font-bold">{stats.totalMessages}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Session Duration</p>
              <p className="text-3xl font-bold">{Math.round(stats.averageSessionDuration)}m</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User Satisfaction</p>
              <p className="text-3xl font-bold">{stats.userSatisfaction}%</p>
            </div>
            <ThumbsUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Top Queries */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Queries</h3>
        <div className="space-y-3">
          {stats.topQueries.map((query, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{query.query}</span>
              <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                {query.count}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Daily Stats Chart Placeholder */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Activity</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart visualization would be implemented here
        </div>
      </Card>
    </div>
  );
};

export default ChatbotAnalytics;
