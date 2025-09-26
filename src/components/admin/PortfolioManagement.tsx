import React from 'react';
import Card from '../ui/Card';

const PortfolioManagement: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Portfolio Management</h1>
      <Card className="p-6">
        <p className="text-gray-500">
          CRUD for portfolio projects, with real-time previews and version history, will be implemented here.
        </p>
      </Card>
    </div>
  );
};

export default PortfolioManagement;
