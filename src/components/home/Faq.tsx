import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Card from '../ui/Card';

const faqs = [
  {
    question: "How do you ensure data security?",
    answer: "We follow enterprise-grade protocols including end-to-end encryption, regular security audits, and secure coding practices. We are compliant with GDPR, HIPAA, and other major regulations to ensure your data is always protected."
  },
  {
    question: "What if my project requires unique technology?",
    answer: "Our team thrives on challenges. We have a dedicated R&D department and a flexible, agile approach that allows us to adapt to new technologies and build custom solutions tailored to your specific needs."
  },
  {
    question: "How long does development take?",
    answer: "The timeline depends on the project's scope and complexity. A simple website might take 4-6 weeks, while a complex custom software system could take 6 months or more. We provide a detailed project plan with clear milestones and timelines after our initial consultation."
  },
  {
    question: "What is the 'Royal Client Experience'?",
    answer: "It's our promise to treat you as a partner, not just a client. This means proactive communication, transparent processes, on-time delivery, and dedicated post-launch support to ensure your long-term success."
  }
];

const FaqItem: React.FC<{ faq: typeof faqs[0]; isOpen: boolean; onClick: () => void }> = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center py-5 text-left"
      >
        <span className="font-semibold text-lg">{faq.question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: '0.5rem', marginBottom: '1.25rem' }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop" 
              alt="Abstract colorful background"
              className="rounded-xl shadow-lg"
            />
          </div>
          <Card className="p-8">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Faq;
