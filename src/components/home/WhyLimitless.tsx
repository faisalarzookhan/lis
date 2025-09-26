import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Brush, TrendingUp, Zap, BrainCircuit, Award } from 'lucide-react';
import Card from '../ui/Card';

const qualities = [
  { title: "Total Security", icon: Lock, text: "Enterprise-grade encryption, secure coding, and compliance. Your data is our priority." },
  { title: "True Uniqueness", icon: Brush, text: "No two businesses are the same. We craft solutions uniquely tailored to your brand and industry." },
  { title: "Reliability & Scalability", icon: TrendingUp, text: "From startups to enterprises—our systems are stable, flexible, and built to scale with you." },
  { title: "Speed + Performance", icon: Zap, text: "Lightning-fast load times and seamless performance, even under peak traffic." },
  { title: "Smart & Future-Ready", icon: BrainCircuit, text: "AI, automation, and cloud integration—future-proofing your digital presence today." },
  { title: "Royal Client Experience", icon: Award, text: "You’re a partner, not a client. Proactive communication, on-time delivery, and post-launch support." },
];

const WhyLimitless: React.FC = () => {
  return (
    <section className="section-padding bg-gray-bg dark:bg-gray-900/50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Businesses Choose Us</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our commitment to excellence is reflected in every solution we deliver.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {qualities.map((quality, index) => {
            const Icon = quality.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full border-l-4 border-accent">
                  <div className="flex items-center space-x-4 mb-4">
                    <Icon className="w-8 h-8 text-accent" />
                    <h3 className="text-xl font-bold">{quality.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{quality.text}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyLimitless;
