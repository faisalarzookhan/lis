import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Cloud, Puzzle } from 'lucide-react';
import Card from '../ui/Card';

const solutions = [
  {
    title: 'Enterprise-Grade Excellence',
    icon: Check,
    text: 'Transformation, automation, and scalable platforms tailored for your business needs.',
    link: '/services',
  },
  {
    title: 'Industry-Focused Platforms',
    icon: Puzzle,
    text: 'Robust solutions for finance, healthcare, education—built to solve unique challenges.',
    link: '/portfolio',
  },
  {
    title: 'Future-Proof Architectures',
    icon: Cloud,
    text: 'Secure cloud deployments, AI analytics, and multi-tenant systems that grow with you.',
    link: '/about',
  },
];

const SolutionsOverview: React.FC = () => {
  return (
    <section className="section-padding bg-gray-bg dark:bg-gray-900/50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Architects of Transformation</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            At Limitless, we don’t just build software—we redefine digital identities. From concept to code, every solution is crafted with precision, creativity, and a focus on future growth.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 text-center h-full">
                  <div className="inline-block p-4 bg-accent/10 rounded-full mb-6">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{solution.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{solution.text}</p>
                  <Link href={solution.link} className="font-medium text-accent hover:underline">
                    Learn More &rarr;
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionsOverview;
