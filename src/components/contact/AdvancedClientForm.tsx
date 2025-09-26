import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedFormData } from '../../types';

const steps = [
  { id: 1, name: 'Business Basics' },
  { id: 2, name: 'Project Details' },
  { id: 3, name: 'Timeline & Budget' },
];

const AdvancedClientForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, trigger } = useForm<AdvancedFormData>();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const onSubmit = () => {
    // Form submitted successfully
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8">
        <h3 className="text-2xl font-bold text-green-500 mb-4">Project Details Received!</h3>
        <p>Thank you for your detailed submission. Our team will review your requirements and reach out within 24 hours to schedule a consultation.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map(step => (
            <div key={step.id} className={`text-sm font-medium ${currentStep >= step.id ? 'text-accent' : 'text-gray-400'}`}>
              Step {step.id}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-accent h-2 rounded-full"
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-6">{steps[currentStep-1].name}</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <input {...register('companyName', { required: true })} placeholder="Company Name" className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                <input {...register('industry', { required: true })} placeholder="Industry (e.g., Finance, Healthcare)" className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                <select {...register('businessStage', { required: true })} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <option value="">Business Stage...</option>
                  <option value="Startup">Startup</option>
                  <option value="Growth">Growth</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
                <textarea {...register('currentChallenges')} placeholder="Current Challenges (optional)" rows={3} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"></textarea>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-6">
                <select {...register('serviceType', { required: true })} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <option value="">Service Type...</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Custom Software">Custom Software</option>
                  <option value="CRM Development">CRM Development</option>
                  <option value="AI & Automation">AI & Automation</option>
                </select>
                <textarea {...register('desiredFeatures')} placeholder="Desired Features (e.g., user login, payment gateway)" rows={3} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"></textarea>
                <input {...register('techPreferences')} placeholder="Technology Preferences (optional, e.g., React, Python)" className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6">
                <select {...register('budgetRange', { required: true })} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <option value="">Budget Range...</option>
                  <option value="$10k-$50k">$10k - $50k</option>
                  <option value="$50k-$100k">$50k - $100k</option>
                  <option value="$100k+">$100k+</option>
                </select>
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="date" {...register('preferredStartDate')} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                  <input type="date" {...register('targetCompletionDate')} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <textarea {...register('additionalNotes')} placeholder="Additional Notes (optional)" rows={3} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"></textarea>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <button type="button" onClick={handleBack} disabled={currentStep === 1} className="btn-secondary disabled:opacity-50">
            Back
          </button>
          {currentStep < steps.length ? (
            <button type="button" onClick={handleNext} className="btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" className="btn-primary">
              Submit Project
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default AdvancedClientForm;
