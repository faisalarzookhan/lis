import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Project } from '../types';
import Card from '../components/ui/Card';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import LazyImage from '../components/ui/LazyImage';
import VideoPreview from '../components/portfolio/VideoPreview';
import ProjectTimeline from '../components/portfolio/ProjectTimeline';
import EnhancedModal from '../components/portfolio/EnhancedModal';
import ClientTestimonialIntegration from '../components/portfolio/ClientTestimonialIntegration';

const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({ industry: 'All', serviceType: 'All', projectSize: 'All' });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*').order('id');
      
      if (error) {
        setError(error.message);
        console.error('Error fetching projects:', error);
      } else if (data) {
        setProjects(data as Project[]);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const industries = useMemo(() => [...new Set(projects.map(p => p.industry))], [projects]);
  const serviceTypes = useMemo(() => [...new Set(projects.map(p => p.serviceType))], [projects]);
  const projectSizes = useMemo(() => [...new Set(projects.map(p => p.projectSize))], [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      (filters.industry === 'All' || p.industry === filters.industry) &&
      (filters.serviceType === 'All' || p.serviceType === filters.serviceType) &&
      (filters.projectSize === 'All' || p.projectSize === filters.projectSize)
    );
  }, [filters, projects]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pt-20">
      <header className="section-padding bg-gray-bg dark:bg-gray-900/50 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Portfolio</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore our successful projects and see how we've transformed businesses across various industries.
        </p>
      </header>

      <div className="container-custom section-padding">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <SkeletonLoader width="3rem" height="3rem" rounded />
                  <SkeletonLoader width="60%" height="1.5rem" />
                </div>
                <SkeletonLoader width="100%" height="1rem" className="mb-2" />
                <SkeletonLoader width="90%" height="1rem" className="mb-2" />
                <SkeletonLoader width="80%" height="1rem" className="mb-6" />
                <SkeletonLoader width="40%" height="1rem" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select name="industry" value={filters.industry} onChange={handleFilterChange} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <option value="All">All Industries</option>
                  {industries.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
                <select name="serviceType" value={filters.serviceType} onChange={handleFilterChange} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <option value="All">All Services</option>
                  {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select name="projectSize" value={filters.projectSize} onChange={handleFilterChange} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <option value="All">All Project Sizes</option>
                  {projectSizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Video Previews Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Featured Project Videos</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <VideoPreview
                  src="/videos/project-demo-1.mp4"
                  poster="/images/project-poster-1.jpg"
                  title="E-commerce Platform Demo"
                  description="See our latest e-commerce solution in action"
                  className="h-64"
                />
                <VideoPreview
                  src="/videos/project-demo-2.mp4"
                  poster="/images/project-poster-2.jpg"
                  title="Mobile App Showcase"
                  description="Interactive demo of our mobile application"
                  className="h-64"
                />
              </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map(project => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    setSelectedProject(project);
                    setShowModal(true);
                  }}
                >
                  <Card className="h-full overflow-hidden cursor-pointer group">
                    <div className="relative">
                      <LazyImage
                        src={project.image}
                        alt={project.title}
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <span className="text-xs font-semibold bg-accent-orange/20 text-accent-orange px-2 py-1 rounded-full">{project.industry}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                      <button className="font-medium text-accent hover:underline">
                        View Case Study &rarr;
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Enhanced Modal */}
      {selectedProject && showModal && (
        <EnhancedModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedProject(null);
          }}
          project={{
            id: selectedProject.id,
            title: selectedProject.title,
            description: selectedProject.description,
            beforeImage: selectedProject.image, // Placeholder
            afterImage: selectedProject.image, // Placeholder
            techStack: selectedProject.techStack.map(tech => ({
              name: tech,
              icon: 'code',
              category: 'frontend' as const
            })),
            challenge: selectedProject.challenge,
            solution: selectedProject.solution,
            results: selectedProject.results,
            caseStudyUrl: `/portfolio/case-study-${selectedProject.id}`
          }}
        />
      )}

      {/* Project Timeline Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Development Process</h2>
        <ProjectTimeline items={[
          {
            id: '1',
            title: 'Discovery & Planning',
            description: 'Understanding client requirements and planning the project scope',
            date: 'Week 1-2',
            status: 'completed',
            challenges: 'Complex requirements and tight deadlines',
            solutions: 'Agile methodology and clear communication channels'
          },
          {
            id: '2',
            title: 'Design & Prototyping',
            description: 'Creating wireframes, mockups, and interactive prototypes',
            date: 'Week 3-4',
            status: 'completed',
            challenges: 'User experience optimization',
            solutions: 'User testing and iterative design process'
          },
          {
            id: '3',
            title: 'Development',
            description: 'Building the solution with modern technologies',
            date: 'Week 5-8',
            status: 'in-progress',
            challenges: 'Technical complexity and integration',
            solutions: 'Modular architecture and continuous integration'
          },
          {
            id: '4',
            title: 'Testing & Deployment',
            description: 'Quality assurance and production deployment',
            date: 'Week 9-10',
            status: 'upcoming',
            challenges: 'Cross-browser compatibility',
            solutions: 'Comprehensive testing suite and deployment automation'
          }
        ]} />
      </div>

      {/* Client Testimonials Integration */}
      {selectedProject && (
        <div className="mt-16">
          <ClientTestimonialIntegration
            testimonials={[
              {
                id: '1',
                name: 'Sarah Johnson',
                role: 'CTO',
                company: 'TechCorp Inc.',
                content: 'The team delivered exceptional results that exceeded our expectations. The attention to detail and technical expertise was outstanding.',
                rating: 5,
                projectId: selectedProject.id
              }
            ]}
            projectId={selectedProject.id}
          />
        </div>
      )}
    </div>
  );
};

export default Portfolio;
