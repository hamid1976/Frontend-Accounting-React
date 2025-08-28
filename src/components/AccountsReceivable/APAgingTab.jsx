import React from 'react';
import { getAgingData } from './AccountsReceivableUtils/apCalculations';
import { formatCurrency } from './AccountsReceivableUtils/formatters';

const APAgingTab = ({ salesData, customers }) => {
  const aging = getAgingData(salesData);
  
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Aging Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aging Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="font-medium text-green-800">Current (0-30 days)</span>
              <span className="font-bold text-green-900">{formatCurrency(aging.current)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
              <span className="font-medium text-yellow-800">31-60 days</span>
              <span className="font-bold text-yellow-900">{formatCurrency(aging.days30)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
              <span className="font-medium text-orange-800">61-90 days</span>
              <span className="font-bold text-orange-900">{formatCurrency(aging.days60)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded">
              <span className="font-medium text-red-800">Over 90 days</span>
              <span className="font-bold text-red-900">{formatCurrency(aging.over90)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Outstanding</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(aging.current + aging.days30 + aging.days60 + aging.days90 + aging.over90)}
              </span>
            </div>
          </div>
        </div>

        {/* Collection Priority */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Priority</h3>
          <div className="space-y-3">
            {customers
              .filter(customer => customer.overdueAmount > 0)
              .sort((a, b) => b.overdueAmount - a.overdueAmount)
              .slice(0, 5)
              .map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                  <div>
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">
                      Last payment: {customer.lastPayment}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-900">{formatCurrency(customer.overdueAmount)}</div>
                    <div className="text-xs text-red-700">#{index + 1} Priority</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APAgingTab;