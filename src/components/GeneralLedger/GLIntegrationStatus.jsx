import React from 'react';
import { RefreshCw, FileText } from 'lucide-react';

const GLIntegrationStatus = () => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center mb-2">
          <RefreshCw className="text-blue-600 mr-2" size={16} />
          <h4 className="font-medium text-blue-800">Dual API Integration</h4>
        </div>
        <p className="text-sm text-blue-700">
          Sales and Purchase orders automatically create journal entries from live API data
        </p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center mb-2">
          <RefreshCw className="text-blue-600 mr-2" size={16} />
          <h4 className="font-medium text-blue-800">Real-time Sync</h4>
        </div>
        <p className="text-sm text-blue-700">
          Journal entries updated automatically with each sales transaction
        </p>
      </div>

      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center mb-2">
          <FileText className="text-orange-600 mr-2" size={16} />
          <h4 className="font-medium text-orange-800">Manual Entries</h4>
        </div>
        <p className="text-sm text-orange-700">
          Add adjustments and corrections with full double-entry validation
        </p>
      </div>
    </div>
  );
};

export default GLIntegrationStatus;