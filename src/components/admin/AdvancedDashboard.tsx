'use client';

import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface DashboardStats {
  totalPages: number;
  publishedPages: number;
  totalTestimonials: number;
  approvedTestimonials: number;
  totalLeads: number;
  recentLeads: number;
  totalProjects: number;
  publishedProjects: number;
}

interface RecentActivity {
  id: string;
  type: 'page' | 'testimonial' | 'lead' | 'project';
  action: string;
  title: string;
  timestamp: string;
}

interface PageData {
  id: string;
  page_name: string;
  content: Record<string, unknown> | null;
  is_published: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

interface TestimonialData {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
  approved: boolean;
  page_id?: string;
  created_at: string;
  updated_at: string;
}

interface LeadData {
  id: string;
  business_basics: Record<string, unknown>;
  project_details: Record<string, unknown>;
  timeline_budget: Record<string, unknown>;
  source_page: string;
  lead_score: number;
  created_at: string;
  updated_at: string;
}

interface ProjectData {
  id: string;
  title: string;
  description: string;
  challenge: string;
  solution: string;
  results: Record<string, unknown>;
  tech_stack: Record<string, unknown>;
  industry: string;
  service_type: string;
  project_size: string;
  image: string;
  is_published: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

const AdvancedDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats from various APIs
      const [pagesRes, testimonialsRes, leadsRes, projectsRes] = await Promise.all([
        fetch('/api/pages'),
        fetch('/api/testimonials'),
        fetch('/api/leads'),
        fetch('/api/projects'),
      ]);

      const [pagesData, testimonialsData, leadsData, projectsData] = await Promise.all([
        pagesRes.json(),
        testimonialsRes.json(),
        leadsRes.json(),
        projectsRes.json(),
      ]);

      // Calculate stats
      const dashboardStats: DashboardStats = {
        totalPages: pagesData.pages?.length || 0,
        publishedPages: pagesData.pages?.filter((p: unknown) => (p as PageData).is_published).length || 0,
        totalTestimonials: testimonialsData.testimonials?.length || 0,
        approvedTestimonials: testimonialsData.testimonials?.filter((t: unknown) => (t as TestimonialData).approved).length || 0,
        totalLeads: leadsData.leads?.length || 0,
        recentLeads: leadsData.leads?.filter((l: unknown) =>
          new Date((l as LeadData).created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0,
        totalProjects: projectsData.projects?.length || 0,
        publishedProjects: projectsData.projects?.filter((p: unknown) => (p as ProjectData).is_published).length || 0,
      };

      setStats(dashboardStats);

      // Generate recent activity (mock data for now)
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'lead',
          action: 'New lead received',
          title: 'John Doe - Web Development Project',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          type: 'page',
          action: 'Page updated',
          title: 'Services page content updated',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'testimonial',
          action: 'Testimonial approved',
          title: 'Sarah Johnson testimonial approved',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setRecentActivity(activities);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return <div>No data available</div>;

  const statCards = [
    {
      title: 'Total Pages',
      value: stats.totalPages,
      subtitle: `${stats.publishedPages} published`,
      icon: FileText,
      color: 'blue',
    },
    {
      title: 'Testimonials',
      value: stats.totalTestimonials,
      subtitle: `${stats.approvedTestimonials} approved`,
      icon: MessageSquare,
      color: 'green',
    },
    {
      title: 'Leads',
      value: stats.totalLeads,
      subtitle: `${stats.recentLeads} this week`,
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Projects',
      value: stats.totalProjects,
      subtitle: `${stats.publishedProjects} published`,
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'page':
        return <FileText className="w-4 h-4" />;
      case 'testimonial':
        return <MessageSquare className="w-4 h-4" />;
      case 'lead':
        return <Users className="w-4 h-4" />;
      case 'project':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'page':
        return 'text-blue-600';
      case 'testimonial':
        return 'text-green-600';
      case 'lead':
        return 'text-purple-600';
      case 'project':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {card.subtitle}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${card.color}-100 dark:bg-${card.color}-900`}>
                  <Icon className={`w-6 h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.title}</p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left">
            <FileText className="w-6 h-6 mb-2 text-blue-600" />
            <h3 className="font-medium">Create New Page</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add a new page to your website</p>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left">
            <MessageSquare className="w-6 h-6 mb-2 text-green-600" />
            <h3 className="font-medium">Review Testimonials</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Approve pending testimonials</p>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left">
            <Users className="w-6 h-6 mb-2 text-purple-600" />
            <h3 className="font-medium">View Leads</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Check recent inquiries</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedDashboard;
