// src/components/AccountsPayable/APSummaryCards.jsx
import React from 'react';
import { DollarSign, AlertTriangle, Clock, Users } from 'lucide-react';
import { formatCurrency } from './AccountPayableUtil/apCalculations';

const APSummaryCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Total A/P</p>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(summary.totalAP)}</p>
          </div>
          <DollarSign className="text-blue-600" size={24} />
        </div>
        <p className="text-sm text-blue-700 mt-2">{summary.vendorsWithBalance} vendors with pending amounts</p>
      </div>

      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-600 text-sm font-medium">Pending Amount</p>
            <p className="text-2xl font-bold text-red-900">{formatCurrency(summary.totalOverdue)}</p>
          </div>
          <AlertTriangle className="text-red-600" size={24} />
        </div>
        <p className="text-sm text-red-700 mt-2">
          {summary.totalAP > 0 ? ((summary.totalOverdue / summary.totalAP) * 100).toFixed(1) : 0}% of total A/P
        </p>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-600 text-sm font-medium">Avg. Days Outstanding</p>
            <p className="text-2xl font-bold text-yellow-900">{summary.avgDaysOutstanding}</p>
          </div>
          <Clock className="text-yellow-600" size={24} />
        </div>
        <p className="text-sm text-yellow-700 mt-2">Payment performance</p>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 text-sm font-medium">Active Vendors</p>
            <p className="text-2xl font-bold text-purple-900">{summary.vendorsWithBalance}</p>
          </div>
          <Users className="text-purple-600" size={24} />
        </div>
        <p className="text-sm text-purple-700 mt-2">Total vendor accounts</p>
      </div>
    </div>
  );
};

export default APSummaryCards;