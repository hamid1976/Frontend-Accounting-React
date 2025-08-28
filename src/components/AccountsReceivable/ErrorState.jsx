import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorState = ({ salesError, customersError, onRetry }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-red-600 mr-2" size={20} />
          <h3 className="font-medium text-red-800">API Connection Error</h3>
        </div>
        <div className="text-red-700 mb-4">
          {salesError && <div>Sales API Error: {salesError}</div>}
          {customersError && <div>Customers API Error: {customersError}</div>}
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
        >
          <RefreshCw size={16} />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorState;