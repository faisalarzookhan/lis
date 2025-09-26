'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Eye, EyeOff, Code, Database, Smartphone } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

interface TechStackItem {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'mobile' | 'other';
}

interface EnhancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    description: string;
    beforeImage: string;
    afterImage: string;
    techStack: TechStackItem[];
    challenge: string;
    solution: string;
    results: string[];
    caseStudyUrl?: string;
  };
}

const EnhancedModal: React.FC<EnhancedModalProps> = ({ isOpen, onClose, project }) => {
  const [showBefore, setShowBefore] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'results'>('overview');

  const getTechIcon = (category: TechStackItem['category']) => {
    switch (category) {
      case 'frontend':
        return <Code className="w-4 h-4" />;
      case 'backend':
        return <Database className="w-4 h-4" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {project.caseStudyUrl && (
                    <motion.a
                      href={project.caseStudyUrl}
                      download
                      className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Case Study</span>
                    </motion.a>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-4 mt-6">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'tech', label: 'Tech Stack' },
                  { id: 'results', label: 'Results' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-accent text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Before/After Comparison */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Before & After</h3>
                    <div className="relative">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative">
                          <LazyImage
                            src={project.beforeImage}
                            alt="Before"
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Before
                          </div>
                        </div>
                        <div className="relative">
                          <LazyImage
                            src={project.afterImage}
                            alt="After"
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            After
                          </div>
                        </div>
                      </div>

                      {/* Toggle Button */}
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => setShowBefore(!showBefore)}
                          className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {showBefore ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          <span>{showBefore ? 'Show After' : 'Show Before'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Challenge & Solution */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Challenge</h3>
                      <p className="text-gray-700 dark:text-gray-300">{project.challenge}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">Solution</h3>
                      <p className="text-gray-700 dark:text-gray-300">{project.solution}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tech' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Technology Stack</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {project.techStack.map((tech, index) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center"
                      >
                        <div className="flex justify-center mb-2">
                          {getTechIcon(tech.category)}
                        </div>
                        <div className="font-semibold">{tech.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {tech.category}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'results' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Key Results</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {project.results.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <span className="text-gray-800 dark:text-gray-200">{result}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedModal;
