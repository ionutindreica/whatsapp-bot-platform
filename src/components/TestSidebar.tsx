import React from 'react';
import { NavLink } from 'react-router-dom';
import { Database } from 'lucide-react';

const TestSidebar: React.FC = () => {
  return (
    <div className="w-72 bg-gray-100 p-4">
      <h2 className="text-lg font-bold mb-4">Test Sidebar</h2>
      <div className="space-y-2">
        <NavLink 
          to="/dashboard" 
          className="block p-2 bg-blue-500 text-white rounded"
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/dashboard/crm" 
          className="block p-2 bg-green-500 text-white rounded flex items-center"
        >
          <Database className="w-4 h-4 mr-2" />
          CRM Light
        </NavLink>
      </div>
    </div>
  );
};

export default TestSidebar;