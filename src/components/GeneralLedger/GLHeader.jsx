import React from 'react';
import { Book, RefreshCw, AlertCircle } from 'lucide-react';

const GLHeader = ({ loading, errors }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
        <Book className="mr-3 text-emerald-600" />
        General Ledger
      </h1>
      <p className="text-gray-600">Real-time transaction recording and journal entry management</p>
      
      {loading.accounts && (
        <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md text-sm flex items-center">
          <RefreshCw className="animate-spin mr-2" size={16} />
          Loading chart of accounts...
        </div>
      )}
      
      {errors.accounts && (
        <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm flex items-center">
          <AlertCircle className="mr-2" size={16} />
          Error loading accounts: {errors.accounts}
        </div>
      )}

      {loading.entries && (
        <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md text-sm flex items-center">
          <RefreshCw className="animate-spin mr-2" size={16} />
          Loading journal entries...
        </div>
      )}
      
      {errors.entries && (
        <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm flex items-center">
          <AlertCircle className="mr-2" size={16} />
          Error loading entries: {errors.entries}
        </div>
      )}
    </div>
  );
};

export default GLHeader;