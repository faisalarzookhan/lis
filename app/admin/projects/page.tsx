'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Eye, Edit, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import Card from '../../../src/components/ui/Card';


interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  owner_id: string | null;
  assigned_to: string | null;
  due_date: string | null;
  client_name: string | null;
  created_at: string;
  updated_at: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // For now, use mock data since the table might not exist yet
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'E-commerce Website Redesign',
          description: 'Complete redesign of the company e-commerce platform',
          status: 'in_progress',
          priority: 'high',
          owner_id: null,
          assigned_to: null,
          due_date: '2024-12-31',
          client_name: 'TechCorp Inc.',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Mobile App Development',
          description: 'Native iOS and Android app for inventory management',
          status: 'pending',
          priority: 'medium',
          owner_id: null,
          assigned_to: null,
          due_date: '2024-11-30',
          client_name: 'LogisticsPro',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z',
        },
        {
          id: '3',
          title: 'AI Chatbot Implementation',
          description: 'Integrate AI-powered chatbot for customer support',
          status: 'completed',
          priority: 'high',
          owner_id: null,
          assigned_to: null,
          due_date: '2024-10-15',
          client_name: 'SupportPlus',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z',
        },
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      // Update project status
      setProjects(projects.map(project =>
        project.id === projectId
          ? { ...project, status: newStatus, updated_at: new Date().toISOString() }
          : project
      ));

      // Log activity (mock for now)
      console.log(`Project ${projectId} status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.client_name && project.client_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'urgent': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track business projects</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  {project.client_name && (
                    <span>Client: {project.client_name}</span>
                  )}
                  {project.due_date && (
                    <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
                  )}
                  <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {/* Dropdown menu would go here */}
                </div>
              </div>
            </div>

            {/* Action buttons for status changes */}
            <div className="mt-4 flex items-center space-x-2">
              {project.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusChange(project.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(project.id, 'rejected')}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </>
              )}
              {project.status === 'approved' && (
                <button
                  onClick={() => handleStatusChange(project.id, 'in_progress')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Start Project
                </button>
              )}
              {project.status === 'in_progress' && (
                <button
                  onClick={() => handleStatusChange(project.id, 'completed')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No projects found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
};

export default ProjectsPage;
