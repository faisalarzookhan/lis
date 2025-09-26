import React, { useState, useEffect } from 'react';
import { Target, MessageSquare, Briefcase, Users, TrendingUp, Calendar, Mail, CheckCircle, XCircle } from 'lucide-react';
import Card from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../../lib/supabaseClient';

interface DashboardStats {
  totalLeads: number;
  newTestimonials: number;
  portfolioProjects: number;
  adminUsers: number;
  activeProjects: number;
  pendingApprovals: number;
  completedProjects: number;
  emailNotifications: number;
}

interface ChartData {
  name: string;
  value: number;
  date?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newTestimonials: 0,
    portfolioProjects: 0,
    adminUsers: 0,
    activeProjects: 0,
    pendingApprovals: 0,
    completedProjects: 0,
    emailNotifications: 0,
  });

  const [projectTimelineData, setProjectTimelineData] = useState<ChartData[]>([]);
  const [approvalData, setApprovalData] = useState<ChartData[]>([]);
  const [projectStatusData, setProjectStatusData] = useState<ChartData[]>([]);
  const [workloadData, setWorkloadData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats from various tables
      const [leadsRes, testimonialsRes, projectsRes, usersRes] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact' }),
        supabase.from('testimonials').select('id', { count: 'exact' }).eq('approved', false),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
      ]);

      const totalLeads = leadsRes.count || 0;
      const newTestimonials = testimonialsRes.count || 0;
      const portfolioProjects = projectsRes.count || 0;
      const adminUsers = usersRes.count || 0;

      // Mock business project stats for now (will be replaced with real data once tables are created)
      const activeProjects = 12;
      const pendingApprovals = 5;
      const completedProjects = 28;

      setStats({
        totalLeads,
        newTestimonials,
        portfolioProjects,
        adminUsers,
        activeProjects,
        pendingApprovals,
        completedProjects,
        emailNotifications: 0, // Will be implemented with email integration
      });

      // Generate mock chart data
      generateChartData();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    // Project timeline data (last 30 days) - mock data
    const timelineData: ChartData[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const count = Math.floor(Math.random() * 5);
      timelineData.push({ name: date.toLocaleDateString(), value: count });
    }
    setProjectTimelineData(timelineData);

    // Approval data - mock data
    setApprovalData([
      { name: 'Approved', value: 28 },
      { name: 'Rejected', value: 7 },
    ]);

    // Project status distribution - mock data
    setProjectStatusData([
      { name: 'Pending', value: 5 },
      { name: 'In Progress', value: 12 },
      { name: 'Completed', value: 28 },
      { name: 'Approved', value: 22 },
    ]);

    // Workload data - mock data
    setWorkloadData([
      { name: 'Low', value: 20 },
      { name: 'Medium', value: 35 },
      { name: 'High', value: 25 },
      { name: 'Critical', value: 10 },
    ]);
  };

  const statCards = [
    { label: 'Active Projects', value: stats.activeProjects, icon: Target, color: 'text-blue-500' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: CheckCircle, color: 'text-orange-500' },
    { label: 'Completed Projects', value: stats.completedProjects, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Email Notifications', value: stats.emailNotifications, icon: Mail, color: 'text-purple-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Power BI Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Interactive analytics and project management overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gray-100 dark:bg-gray-700 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Timeline Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectTimelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Approval/Rejection Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Approvals vs Rejections</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={approvalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Project Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Workload Heatmap */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Workload Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workloadData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">New project approved</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Lead converted to project</p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Testimonial awaiting approval</p>
              <p className="text-xs text-gray-500">6 hours ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
