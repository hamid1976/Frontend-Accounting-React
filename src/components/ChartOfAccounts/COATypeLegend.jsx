import React from 'react';

const COATypeLegend = ({ accountTypes }) => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Account Types & Code Ranges</h3>
      <div className="flex flex-wrap gap-4">
        {Object.entries(accountTypes).map(([key, type]) => (
          <div key={key} className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${type.color}`}>
              {type.label}
            </span>
            <span className="text-sm text-gray-600 font-mono">{type.codeRange}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default COATypeLegend;