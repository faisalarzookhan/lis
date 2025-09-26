import React from 'react';
import { motion } from 'framer-motion';

const partnerLogos = [
  'FintechPro', 'MediCare Inc.', 'TechPivot', 'EduWorks', 'LogixOne'
];

const Partners: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
      <div className="container-custom">
        <h3 className="text-center text-gray-500 dark:text-gray-400 font-medium mb-8">
          Pioneering transformation with trusted partners worldwide
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {partnerLogos.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">{logo}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
