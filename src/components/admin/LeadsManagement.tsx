import React from 'react';
import Card from '../ui/Card';

const LeadsManagement: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Leads Management</h1>
      <Card className="p-6">
        <p className="text-gray-500">
          A dashboard to visualize and manage leads, with analytics and filters, will be implemented here.
        </p>
      </Card>
    </div>
  );
};

export default LeadsManagement;
