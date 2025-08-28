import React from 'react';
import { CreditCard } from 'lucide-react';

const APHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
        <CreditCard className="mr-3 text-emerald-600" />
        Accounts Receivable
      </h1>
      <p className="text-gray-600">Manage customer invoicing, payments, and credit limits</p>
    </div>
  );
};

export default APHeader;