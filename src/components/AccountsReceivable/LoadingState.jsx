import React from 'react';
import { Loader } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center space-x-3">
        <Loader className="animate-spin text-emerald-600" size={24} />
        <span className="text-gray-600">Loading data from API...</span>
      </div>
    </div>
  );
};

export default LoadingState;