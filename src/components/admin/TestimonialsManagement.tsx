import React from 'react';
import Card from '../ui/Card';

const TestimonialsManagement: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Testimonials Management</h1>
      <Card className="p-6">
        <p className="text-gray-500">
          Tools to moderate, approve, and manage client testimonials will be implemented here.
        </p>
      </Card>
    </div>
  );
};

export default TestimonialsManagement;
