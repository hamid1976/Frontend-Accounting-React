import React from 'react';
import { FileText, TrendingUp, Edit, DollarSign } from 'lucide-react';

const GLStats = ({ journalEntries }) => {
  const totalEntries = journalEntries.length;
  const purchaseEntries = journalEntries.filter(e => e.source === 'Purchase Orders').length;
  const manualEntries = journalEntries.filter(e => e.transactionType === 'manual').length;
  const totalValue = journalEntries.reduce((sum, entry) => sum + entry.totalDebit, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Total Entries</p>
            <p className="text-2xl font-bold text-blue-900">{totalEntries}</p>
          </div>
          <FileText className="text-blue-600" size={24} />
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium">Purchase Entries</p>
            <p className="text-2xl font-bold text-green-900">{purchaseEntries}</p>
          </div>
          <TrendingUp className="text-green-600" size={24} />
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-600 text-sm font-medium">Manual Entries</p>
            <p className="text-2xl font-bold text-orange-900">{manualEntries}</p>
          </div>
          <Edit className="text-orange-600" size={24} />
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 text-sm font-medium">Total Value</p>
            <p className="text-2xl font-bold text-purple-900">
              PKR {totalValue.toLocaleString('en-PK', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </p>
          </div>
          <DollarSign className="text-purple-600" size={24} />
        </div>
      </div>
    </div>
  );
};

export default GLStats;