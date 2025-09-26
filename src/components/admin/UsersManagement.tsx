import React from 'react';
import Card from '../ui/Card';

const UsersManagement: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Users Management</h1>
      <Card className="p-6">
        <p className="text-gray-500">
          Role-Based Access Control (RBAC) and user lifecycle management tools will be implemented here.
        </p>
      </Card>
    </div>
  );
};

export default UsersManagement;
