import React from 'react';
import { API_BASE_URL } from '../../utils/apiConfig';

const COAAPIStatus = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 className="text-sm font-semibold text-blue-800 mb-2">API Integration Status</h3>
      <div className="text-xs text-blue-700 space-y-1">
        <p>• Connected to: {API_BASE_URL}</p>
        <p>• Auto-refresh after CRUD operations</p>
        <p>• Real-time data from Spring Boot backend</p>
        <p>• Hierarchical structure maintained server-side</p>
      </div>
    </div>
  );
};

export default COAAPIStatus;