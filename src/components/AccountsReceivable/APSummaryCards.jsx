// import React from 'react';
// import { DollarSign, AlertTriangle, Clock, Users } from 'lucide-react';
// import { calculateARSummary, getAgingData } from '../../Utility/apCalculations';
// import { formatCurrency } from '../../Utility/formatters';

// const APSummaryCards = ({ customers, allSalesData }) => {
//   const summary = calculateARSuummary(customers, allSalesData);
//      const aging = getAgingDataata(salesData);
   
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//       <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-blue-600 text-sm font-medium">Total A/R</p>
//             <p className="text-2xl font-bold text-blue-900">{formatCurrency(aging.current + aging.days30 + aging.days60 + aging.days90 + aging.over90)}</p>
//           </div>
//           <DollarSign className="text-blue-600" size={24} />
//         </div>
//         <p className="text-sm text-blue-700 mt-2">{summary.customersWithBalance} customers with balances</p>
//       </div>

//       <div className="bg-red-50 p-6 rounded-lg border border-red-200">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-red-600 text-sm font-medium">Overdue Amount</p>
//             <p className="text-2xl font-bold text-red-900">{formatCurrency(summary.totalOverdue)}</p>
//           </div>
//           <AlertTriangle className="text-red-600" size={24} />
//         </div>
//         <p className="text-sm text-red-700 mt-2">
//           {summary.totalAR > 0 ? ((summary.totalOverdue / summary.totalAR) * 100).toFixed(1) : 0}% of total A/R
//         </p>
//       </div>

//       <div className="bg-green-50 p-6 rounded-lg border border-green-200">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-green-600 text-sm font-medium">Avg. Days Outstanding</p>
//             <p className="text-2xl font-bold text-green-900">{summary.avgDaysOutstanding}</p>
//           </div>
//           <Clock className="text-green-600" size={24} />
//         </div>
//         <p className="text-sm text-green-700 mt-2">Collection performance</p>
//       </div>

//       <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-purple-600 text-sm font-medium">Active Customers</p>
//             <p className="text-2xl font-bold text-purple-900">{customers.length}</p>
//           </div>
//           <Users className="text-purple-600" size={24} />
//         </div>
//         <p className="text-sm text-purple-700 mt-2">Total customer accounts</p>
//       </div>
//     </div>
//   );
// };

// export default APSummaryCards;


import React from 'react';
import { DollarSign, AlertTriangle, Clock, Users } from 'lucide-react';
import { calculateARSummary, getAgingData } from './AccountsReceivableUtils/apCalculations';
import { formatCurrency } from './AccountsReceivableUtils/formatters';

const APSummaryCards = ({ customers, allSalesData }) => {
  const summary = calculateARSummary(customers, allSalesData);
  const aging = getAgingData(allSalesData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Total A/R</p>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(aging.current + aging.days30 + aging.days60 + aging.days90 + aging.over90)}
            </p>
          </div>
          <DollarSign className="text-blue-600" size={24} />
        </div>
        <p className="text-sm text-blue-700 mt-2">{summary.customersWithBalance} customers with balances</p>
      </div>

      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-600 text-sm font-medium">Overdue Amount</p>
            <p className="text-2xl font-bold text-red-900">{formatCurrency(aging.current + aging.days30 + aging.days60 + aging.days90 + aging.over90)}</p>
          </div>
          <AlertTriangle className="text-red-600" size={24} />
        </div>
        <p className="text-sm text-red-700 mt-2">
          {summary.totalAR > 0 ? ((summary.totalOverdue / summary.totalAR) * 100).toFixed(1) : 0}% of total A/R
        </p>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium">Avg. Days Outstanding</p>
            <p className="text-2xl font-bold text-green-900">{summary.avgDaysOutstanding}</p>
          </div>
          <Clock className="text-green-600" size={24} />
        </div>
        <p className="text-sm text-green-700 mt-2">Collection performance</p>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 text-sm font-medium">Active Customers</p>
            <p className="text-2xl font-bold text-purple-900">{customers.length}</p>
          </div>
          <Users className="text-purple-600" size={24} />
        </div>
        <p className="text-sm text-purple-700 mt-2">Total customer accounts</p>
      </div>
    </div>
  );
};

export default APSummaryCards;
