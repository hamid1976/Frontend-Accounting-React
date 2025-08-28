import React from 'react';
import { CheckCircle } from 'lucide-react';

const APIStatusBadge = ({ salesCount, customersCount }) => {
  return (
    <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center mb-4">
        <CheckCircle className="text-green-600 mr-2" size={20} />
        <h3 className="font-medium text-green-800">POS Integration Active</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
        <div>
          <strong>Sales Orders:</strong> {salesCount} outstanding orders from POS system
        </div>
        <div>
          <strong>Customers:</strong> {customersCount} active customers synchronized
        </div>
        <div>
          <strong>Real-time Updates:</strong> Data refreshes automatically with POS transactions
        </div>
      </div>
      <div className="mt-4 text-xs text-green-600">
        <strong>Note:</strong> Only showing unpaid or unfulfilled orders. Replace Bearer token for live data connection.
      </div>
    </div>
  );
};

export default APIStatusBadge;