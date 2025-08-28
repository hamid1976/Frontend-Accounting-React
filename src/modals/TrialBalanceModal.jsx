// import React from 'react';
// import { X, Download } from 'lucide-react';

// const TrialBalanceModal = ({ trialBalance, filters, setFilters, onClose }) => {
//   const filteredTrialBalance = trialBalance.filter((item) => {
//     if (!filters.dateFrom && !filters.dateTo) return true;
//     const txDate = new Date(item.date);
//     const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
//     const to = filters.dateTo ? new Date(filters.dateTo) : null;
//     if (from && txDate < from) return false;
//     if (to && txDate > to) return false;
//     return true;
//   });

//   const handleExport = () => {
//     alert('Export functionality would be implemented here');
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Trial Balance
//               {filters.dateFrom && filters.dateTo
//                 ? ` (${new Date(filters.dateFrom).toLocaleDateString()} → ${new Date(filters.dateTo).toLocaleDateString()})`
//                 : ` - As of ${new Date().toLocaleDateString()}`}
//             </h3>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={handleExport}
//                 className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 flex items-center space-x-1"
//               >
//                 <Download size={14} />
//                 <span>Export</span>
//               </button>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Date Filters */}
//         <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-3">
//           <input
//             type="date"
//             value={filters.dateFrom || ''}
//             onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
//             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
//           />
//           <span className="text-gray-500">to</span>
//           <input
//             type="date"
//             value={filters.dateTo || ''}
//             onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
//             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
//           />
//           {(filters.dateFrom || filters.dateTo) && (
//             <button
//               onClick={() => setFilters({ ...filters, dateFrom: '', dateTo: '' })}
//               className="ml-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//             >
//               Clear
//             </button>
//           )}
//         </div>

//         <div className="px-6 py-4">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Account Code
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Account Name
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Debit Total
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Credit Total
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Balance
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredTrialBalance.map((item) => (
//                   <tr key={item.accountId}>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {item.accountCode}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {item.accountName}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 py-1 text-xs font-medium rounded-full ${
//                           item.accountType === 'assets'
//                             ? 'bg-green-100 text-green-800'
//                             : item.accountType === 'liabilities'
//                             ? 'bg-red-100 text-red-800'
//                             : item.accountType === 'equity'
//                             ? 'bg-blue-100 text-blue-800'
//                             : item.accountType === 'revenue'
//                             ? 'bg-purple-100 text-purple-800'
//                             : item.accountType === 'expenses'
//                             ? 'bg-orange-100 text-orange-800'
//                             : 'bg-gray-100 text-gray-800'
//                         }`}
//                       >
//                         {item.accountType?.charAt(0).toUpperCase() +
//                           item.accountType?.slice(1) || 'Unknown'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                       PKR{' '}
//                       {item.debit.toLocaleString('en-PK', {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                       PKR{' '}
//                       {item.credit.toLocaleString('en-PK', {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
//                       <span
//                         className={
//                           item.balance >= 0 ? 'text-green-600' : 'text-red-600'
//                         }
//                       >
//                         PKR{' '}
//                         {Math.abs(item.balance).toLocaleString('en-PK', {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}
//                         {item.balance < 0 && ' (CR)'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>

//               <tfoot className="bg-gray-50">
//                 <tr>
//                   <td
//                     colSpan="4"
//                     className="px-4 py-3 text-sm font-bold text-gray-900"
//                   >
//                     TOTALS:
//                   </td>
//                   <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
//                     PKR{' '}
//                     {filteredTrialBalance
//                       .reduce((sum, acc) => sum + acc.debit, 0)
//                       .toLocaleString('en-PK', {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
//                     PKR{' '}
//                     {filteredTrialBalance
//                       .reduce((sum, acc) => sum + acc.credit, 0)
//                       .toLocaleString('en-PK', {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
//                     PKR{' '}
//                     {Math.abs(
//                       filteredTrialBalance.reduce(
//                         (sum, acc) => sum + acc.balance,
//                         0
//                       )
//                     ).toLocaleString('en-PK', {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrialBalanceModal;

// import React from 'react';
// import { X, Download } from 'lucide-react';

// const TrialBalanceModal = ({ trialBalance, filters, setFilters, onClose }) => {
//   const filteredTrialBalance = trialBalance.filter((item) => {
//     if (!filters.dateFrom && !filters.dateTo) return true;
//     // If you want to filter based on journal entry transactions, 
//     // you’d need to aggregate trial balance from those, not accounts summary.
//     return true;
//   });

//   const handleExport = () => {
//     alert('Export functionality would be implemented here');
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Trial Balance
//               {filters.dateFrom && filters.dateTo
//                 ? ` (${new Date(filters.dateFrom).toLocaleDateString()} → ${new Date(filters.dateTo).toLocaleDateString()})`
//                 : ` - As of ${new Date().toLocaleDateString()}`}
//             </h3>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={handleExport}
//                 className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 flex items-center space-x-1"
//               >
//                 <Download size={14} />
//                 <span>Export</span>
//               </button>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Date Filters */}
//         <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-3">
//           <input
//             type="date"
//             value={filters.dateFrom || ''}
//             onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
//             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
//           />
//           <span className="text-gray-500">to</span>
//           <input
//             type="date"
//             value={filters.dateTo || ''}
//             onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
//             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
//           />
//           {(filters.dateFrom || filters.dateTo) && (
//             <button
//               onClick={() => setFilters({ ...filters, dateFrom: '', dateTo: '' })}
//               className="ml-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//             >
//               Clear
//             </button>
//           )}
//         </div>

//         {/* Table */}
//         <div className="px-6 py-4">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Account Code
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Account Name
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Debit Total
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Credit Total
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Balance
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredTrialBalance.map((item) => (
//                   <tr key={item.accountId}>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {item.accountCode}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {item.accountName}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 py-1 text-xs font-medium rounded-full ${
//                           item.accountType === 'assets'
//                             ? 'bg-green-100 text-green-800'
//                             : item.accountType === 'liabilities'
//                             ? 'bg-red-100 text-red-800'
//                             : item.accountType === 'equity'
//                             ? 'bg-blue-100 text-blue-800'
//                             : item.accountType === 'revenue'
//                             ? 'bg-purple-100 text-purple-800'
//                             : item.accountType === 'expenses'
//                             ? 'bg-orange-100 text-orange-800'
//                             : 'bg-gray-100 text-gray-800'
//                         }`}
//                       >
//                         {item.accountType?.charAt(0).toUpperCase() +
//                           item.accountType?.slice(1) || 'Unknown'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                       PKR{' '}
//                       {item.debit.toLocaleString('en-PK', {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                       PKR{' '}
//                       {item.credit.toLocaleString('en-PK', {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
//                       <span
//                         className={
//                           item.balance >= 0 ? 'text-green-600' : 'text-red-600'
//                         }
//                       >
//                         PKR{' '}
//                         {Math.abs(item.balance).toLocaleString('en-PK', {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}
//                         {item.balance < 0 && ' (CR)'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>

//               {/* Totals */}
//               <tfoot className="bg-gray-50">
//                 <tr>
//                   <td
//                     colSpan="3"
//                     className="px-4 py-3 text-sm font-bold text-gray-900"
//                   >
//                     TOTALS:
//                   </td>
//                   <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
//                     PKR{' '}
//                     {filteredTrialBalance
//                       .reduce((sum, acc) => sum + acc.debit, 0)
//                       .toLocaleString('en-PK', {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
//                     PKR{' '}
//                     {filteredTrialBalance
//                       .reduce((sum, acc) => sum + acc.credit, 0)
//                       .toLocaleString('en-PK', {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
//                     PKR{' '}
//                     {Math.abs(
//                       filteredTrialBalance.reduce(
//                         (sum, acc) => sum + acc.balance,
//                         0
//                       )
//                     ).toLocaleString('en-PK', {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrialBalanceModal;




import React, { useState } from 'react';
import { X, Download } from 'lucide-react';

// Helper function for grouping
const groupByDate = (data, groupBy) => {
  const grouped = {};

  data.forEach((item) => {
    const d = new Date(item.date || new Date()); // 🔹 ensure each trial balance row has a "date"
    let key = '';

    switch (groupBy) {
      case 'day':
        key = d.toLocaleDateString();
        break;
      case 'week': {
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        key = `Week of ${weekStart.toLocaleDateString()}`;
        break;
      }
      case 'month':
        key = d.toLocaleString('default', { month: 'long', year: 'numeric' });
        break;
      case 'year':
        key = d.getFullYear();
        break;
      default:
        key = 'All';
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  return grouped;
};

const TrialBalanceModal = ({ trialBalance, filters, setFilters, onClose }) => {
  const [groupBy, setGroupBy] = useState('all'); // 🔹 new state for grouping

  const filteredTrialBalance = trialBalance.filter((item) => {
    if (!filters.dateFrom && !filters.dateTo) return true;
    // If you want to filter based on journal entry transactions, 
    // you’d need to aggregate trial balance from those, not accounts summary.
    return true;
  });

  // 🔹 Apply grouping
  const groupedData = groupByDate(filteredTrialBalance, groupBy);

  const handleExport = () => {
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Trial Balance
              {filters.dateFrom && filters.dateTo
                ? ` (${new Date(filters.dateFrom).toLocaleDateString()} → ${new Date(filters.dateTo).toLocaleDateString()})`
                : ` - As of ${new Date().toLocaleDateString()}`}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExport}
                className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 flex items-center space-x-1"
              >
                <Download size={14} />
                <span>Export</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Date + Group Filters */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-3">
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
          />
          {(filters.dateFrom || filters.dateTo) && (
            <button
              onClick={() => setFilters({ ...filters, dateFrom: '', dateTo: '' })}
              className="ml-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              Clear
            </button>
          )}

          {/* 🔹 Grouping Dropdown */}
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="ml-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="day">Day-wise</option>
            <option value="week">Week-wise</option>
            <option value="month">Month-wise</option>
            <option value="year">Year-wise</option>
          </select>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          <div className="overflow-x-auto">
            {Object.keys(groupedData).map((groupKey) => (
              <div key={groupKey} className="mb-6">
                {groupBy !== 'all' && (
                  <h4 className="text-md font-semibold text-gray-700 mb-2">
                    {groupKey}
                  </h4>
                )}
                <table className="w-full mb-2">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Debit Total
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credit Total
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupedData[groupKey].map((item) => (
                      <tr key={item.accountId}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {item.accountCode}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {item.accountName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              item.accountType === 'assets'
                                ? 'bg-green-100 text-green-800'
                                : item.accountType === 'liabilities'
                                ? 'bg-red-100 text-red-800'
                                : item.accountType === 'equity'
                                ? 'bg-blue-100 text-blue-800'
                                : item.accountType === 'revenue'
                                ? 'bg-purple-100 text-purple-800'
                                : item.accountType === 'expenses'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {item.accountType?.charAt(0).toUpperCase() +
                              item.accountType?.slice(1) || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 text-right">
                          PKR{' '}
                          {item.debit.toLocaleString('en-PK', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 text-right">
                          PKR{' '}
                          {item.credit.toLocaleString('en-PK', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-right">
                          <span
                            className={
                              item.balance >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }
                          >
                            PKR{' '}
                            {Math.abs(item.balance).toLocaleString('en-PK', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            {item.balance < 0 && ' (CR)'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBalanceModal;
