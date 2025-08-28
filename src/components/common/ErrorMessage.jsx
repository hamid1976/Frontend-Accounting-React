import React from 'react';
import { X } from 'lucide-react';

const ErrorMessage = ({ error, onClose }) => {
  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex">
        <div className="flex-1">
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;