'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  image: string;
  link: string;
}

interface CaseStudyPreviewProps {
  caseStudies: CaseStudy[];
  serviceId?: string;
}

const CaseStudyPreview: React.FC<CaseStudyPreviewProps> = ({ caseStudies, serviceId }) => {
  const filteredCaseStudies = serviceId
    ? caseStudies.filter(cs => cs.industry.toLowerCase().includes(serviceId.toLowerCase()))
    : caseStudies.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Success Stories</h3>
        <motion.a
          href="/portfolio"
          whileHover={{ x: 5 }}
          className="text-accent hover:text-accent-dark font-semibold flex items-center space-x-2"
        >
          <span>View All Case Studies</span>
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCaseStudies.map((caseStudy, index) => (
          <motion.div
            key={caseStudy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer"
            onClick={() => window.location.href = caseStudy.link}
          >
            <div className="relative h-48 overflow-hidden">
              <LazyImage
                src={caseStudy.image}
                alt={caseStudy.title}
                width={400}
                height={200}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {caseStudy.industry}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                {caseStudy.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {caseStudy.challenge}
              </p>

              <div className="space-y-2 mb-4">
                {caseStudy.results.slice(0, 2).map((result, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-200">{result}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Client: {caseStudy.client}
                </span>
                <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CaseStudyPreview;
