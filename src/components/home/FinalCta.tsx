import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Phone } from 'lucide-react';

const FinalCta: React.FC = () => {
  return (
    <section className="section-padding bg-accent text-white">
      <div className="container-custom text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl lg:text-4xl font-bold mb-4"
        >
          Ready to Scale Your Business?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-blue-200 max-w-2xl mx-auto mb-8"
        >
          Request a demo or download our brochure to learn how we can partner with you for unparalleled growth.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/contact#get-started"
            className="bg-white text-accent font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
          >
            Request Demo <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link
            href="#"
            className="bg-transparent border-2 border-white text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:bg-white hover:text-accent flex items-center"
          >
            Download Brochure <Download className="w-5 h-5 ml-2" />
          </Link>
          <Link
            href="/contact"
            className="bg-accent-dark text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
          >
            Contact Us <Phone className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCta;
