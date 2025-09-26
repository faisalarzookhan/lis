import React, { useState, useEffect } from 'react';
import { Link as ScrollLink, Element } from 'react-scroll';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Service } from '../types';
import * as Icons from 'lucide-react';
import Card from '../components/ui/Card';
import { CheckCircle } from 'lucide-react';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import ComparisonTable from '../components/services/ComparisonTable';
import ServiceRequestForm from '../components/services/ServiceRequestForm';
import CaseStudyPreview from '../components/services/CaseStudyPreview';
import ServiceTestimonials from '../components/services/ServiceTestimonials';
import ProgressIndicator from '../components/services/ProgressIndicator';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*').order('id');

      if (error) {
        setError(error.message);
      } else if (data) {
        setServices(data as Service[]);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  const sections = services.map(service => ({
    id: String(service.id),
    title: service.title
  }));

  return (
    <div className="pt-20">
      {/* Progress Indicator */}
      <ProgressIndicator sections={sections} />

      <header className="section-padding bg-gray-bg dark:bg-gray-900/50 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl lg:text-5xl font-bold mb-4"
        >
          Our Services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
        >
          Comprehensive digital solutions tailored to your business needs, from web development to AI-powered automation.
        </motion.p>
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
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sticky Sidebar with Icon Navigation */}
            <aside className="lg:w-1/4 lg:sticky top-24 self-start">
              <h3 className="text-xl font-bold mb-6">Navigate Services</h3>
              <div className="grid grid-cols-2 gap-4">
                {services.map(service => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const Icon = (Icons as any)[service.icon] || Icons.Code;
                  const isActive = activeSection === String(service.id);

                  return (
                    <ScrollLink
                      key={service.id}
                      to={String(service.id)}
                      spy={true}
                      smooth={true}
                      offset={-100}
                      duration={500}
                      onSetActive={() => setActiveSection(String(service.id))}
                      className={`group cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${
                        isActive
                          ? 'border-accent bg-accent/10 text-accent shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-accent hover:bg-accent/5'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`p-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-accent/20'
                            : 'bg-accent/10 group-hover:bg-accent/20'
                        }`}>
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <span className="text-sm font-medium leading-tight">{service.title}</span>
                      </div>
                    </ScrollLink>
                  );
                })}
              </div>

              {/* Service Request Form */}
              <div className="mt-8">
                <ServiceRequestForm />
              </div>
            </aside>

            {/* Service Sections */}
            <main className="lg:w-3/4">
              {/* Comparison Table */}
              <div className="mb-12">
                <ComparisonTable services={[
                  {
                    id: 'starter',
                    name: 'Starter',
                    price: '$2,500',
                    features: [
                      { name: 'Basic Website', included: true },
                      { name: 'Mobile Responsive', included: true },
                      { name: 'SEO Optimization', included: false },
                      { name: 'Analytics Setup', included: false },
                      { name: '24/7 Support', included: false }
                    ]
                  },
                  {
                    id: 'professional',
                    name: 'Professional',
                    price: '$7,500',
                    popular: true,
                    features: [
                      { name: 'Advanced Website', included: true },
                      { name: 'Mobile Responsive', included: true },
                      { name: 'SEO Optimization', included: true },
                      { name: 'Analytics Setup', included: true },
                      { name: '24/7 Support', included: false }
                    ]
                  },
                  {
                    id: 'enterprise',
                    name: 'Enterprise',
                    price: '$15,000+',
                    features: [
                      { name: 'Custom Solution', included: true },
                      { name: 'Mobile Responsive', included: true },
                      { name: 'SEO Optimization', included: true },
                      { name: 'Analytics Setup', included: true },
                      { name: '24/7 Support', included: true }
                    ]
                  }
                ]} />
              </div>

              <div className="space-y-24">
                {services.map(service => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const Icon = (Icons as any)[service.icon] || Icons.Code;
                  return (
                    <Element key={service.id} name={String(service.id)}>
                      <motion.section
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Card className="p-8 md:p-12">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="p-4 bg-accent/10 rounded-lg">
                              <Icon className="w-8 h-8 text-accent" />
                            </div>
                            <h2 className="text-3xl font-bold">{service.title}</h2>
                          </div>
                          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{service.description}</p>

                          <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div>
                              <h4 className="font-bold text-lg mb-4">Key Features</h4>
                              <ul className="space-y-3">
                                {service.features.map((feature: string, index: number) => (
                                  <li key={index} className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-gray-bg dark:bg-gray-800/50 p-6 rounded-lg">
                              <h4 className="font-bold text-lg mb-4">Benefits</h4>
                              <p className="text-gray-700 dark:text-gray-200">{service.benefits}</p>
                            </div>
                          </div>

                          {/* Case Study Preview */}
                          <CaseStudyPreview
                            caseStudies={[
                              {
                                id: '1',
                                title: 'E-commerce Platform Transformation',
                                client: 'TechCorp Inc.',
                                industry: 'E-commerce',
                                challenge: 'Needed a scalable platform to handle 10x traffic growth',
                                solution: 'Built custom React-based e-commerce solution with advanced analytics',
                                results: ['300% increase in conversion rate', '50% reduction in load times', '99.9% uptime achieved'],
                                image: '/images/case-study-1.jpg',
                                link: '/portfolio/case-study-1'
                              }
                            ]}
                            serviceId={service.title}
                          />

                          {/* Service Testimonials */}
                          <div className="mt-12">
                            <ServiceTestimonials
                              testimonials={[
                                {
                                  id: '1',
                                  name: 'Sarah Johnson',
                                  role: 'CTO',
                                  company: 'TechCorp Inc.',
                                  content: 'The team delivered exceptional results that exceeded our expectations.',
                                  rating: 5,
                                  service: service.title
                                }
                              ]}
                              serviceId={service.title}
                            />
                          </div>
                        </Card>
                      </motion.section>
                    </Element>
                  );
                })}
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
