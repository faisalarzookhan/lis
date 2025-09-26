import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import Card from '../components/ui/Card';
import GeneralInquiryForm from '../components/contact/GeneralInquiryForm';
import AdvancedClientForm from '../components/contact/AdvancedClientForm';
import LiveChatWidget from '../components/contact/LiveChatWidget';
import FAQPreviewSection from '../components/contact/FAQPreviewSection';
import VirtualTour from '../components/contact/VirtualTour';
import SocialMediaIntegration from '../components/contact/SocialMediaIntegration';

const Contact: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inquiry' | 'project'>('inquiry');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#get-started') {
      setActiveTab('project');
    }
  }, []);

  return (
    <div className="pt-20">
      <header className="section-padding bg-gray-bg dark:bg-gray-900/50 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Let's Connect</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Whether you have a question or are ready to start a project, we're here to help.
        </p>
      </header>
      
      {/* FAQ Preview Section */}
      <section className="section-padding bg-gray-bg dark:bg-gray-900/50">
        <div className="container-custom">
          <FAQPreviewSection />
        </div>
      </section>

      <div className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-accent" />
                  <a href="tel:+917710909492" className="hover:text-accent">+91 7710909492</a>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-accent" />
                  <a href="mailto:Info@limitlessinfotech.com" className="hover:text-accent">Info@limitlessinfotech.com</a>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <p>123 Business Park,</p>
                    <p>Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>

              {/* Virtual Tour */}
              <div className="mt-8">
                <VirtualTour />
              </div>
            </motion.div>

            {/* Forms */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="p-4 sm:p-8">
                <div className="flex border-b mb-6">
                  <button
                    onClick={() => setActiveTab('inquiry')}
                    className={`flex-1 py-3 font-semibold transition-colors ${activeTab === 'inquiry' ? 'text-accent border-b-2 border-accent' : 'text-gray-500'}`}
                  >
                    General Inquiry
                  </button>
                  <button
                    id="get-started"
                    onClick={() => setActiveTab('project')}
                    className={`flex-1 py-3 font-semibold transition-colors ${activeTab === 'project' ? 'text-accent border-b-2 border-accent' : 'text-gray-500'}`}
                  >
                    Start a Project
                  </button>
                </div>

                {activeTab === 'inquiry' ? <GeneralInquiryForm /> : <AdvancedClientForm />}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Social Media Integration */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <SocialMediaIntegration />
        </div>
      </section>

      {/* Live Chat Widget */}
      <LiveChatWidget />
    </div>
  );
};

export default Contact;
