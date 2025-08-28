// import React from 'react';
// import { Search, Plus, Eye, Edit, Mail } from 'lucide-react';
// import { formatCurrency, parseLocalDate } from './AccountsReceivableUtils/formatters';
// import { getCreditStatusColor } from './AccountsReceivableUtils/styleHelpers';

// const APOverviewTab = ({ 
//   filters, 
//   setFilters, 
//   filteredCustomers, 
//   setSelectedCustomer,
//   setShowInvoiceForm 
// }) => {

//   // Filter customers based on lastPayment date
//   const filteredCustomersByPaymentDate = filteredCustomers.filter((customer) => {
//     if (!customer.lastPayment) return true; // include if no payment

//     const paymentDate = parseLocalDate(customer.lastPayment);
//     const from = parseLocalDate(filters.fromDate);
//     const to = parseLocalDate(filters.toDate);

//     if (from && paymentDate < from) return false;

//     if (to) {
//       const endOfTo = new Date(to);
//       endOfTo.setHours(23, 59, 59, 999);
//       if (paymentDate > endOfTo) return false;
//     }

//     return true;
//   });

//   return (
//     <div>
//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-4 mb-6">
//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//           <input
//             type="text"
//             placeholder="Search customers..."
//             value={filters.searchTerm}
//             onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
//             className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//           />
//         </div>

//         {/* From Date */}
//         <div>
//           <label className="block text-xs text-gray-500 mb-1">From</label>
//           <input
//             type="date"
//             value={filters.fromDate || ''}
//             onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
//             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//           />
//         </div>

//         {/* To Date */}
//         <div>
//           <label className="block text-xs text-gray-500 mb-1">To</label>
//           <input
//             type="date"
//             value={filters.toDate || ''}
//             onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
//             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//           />
//         </div>

        

//         {/* New Invoice */}
//         <button
//           onClick={() => setShowInvoiceForm(true)}
//           className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
//         >
//           <Plus size={16} />
//           <span>New Invoice</span>
//         </button>

//         {/* Clear Dates Button */}
//         {(filters.fromDate || filters.toDate) && (
//           <button
//             onClick={() => setFilters({ ...filters, fromDate: '', toDate: '' })}
//             className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
//           >
//             Clear Dates
//           </button>
//         )}
//       </div>

//       {/* Customer List Table */}
//       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Credit Limit
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Balance
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Overdue
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Credit Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Last Payment
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredCustomersByPaymentDate.map((customer) => (
//                 <tr key={customer.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{customer.name}</div>
//                       <div className="text-sm text-gray-500">{customer.id}</div>
//                       <div className="text-xs text-gray-400 flex items-center mt-1">
//                         <Mail className="mr-1" size={12} />
//                         {customer.email}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {formatCurrency(customer.creditLimit)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       {formatCurrency(customer.totalOwed)}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {customer.invoiceCount} invoices
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {customer.overdueAmount > 0 ? (
//                       <span className="text-red-600 font-medium">
//                         {formatCurrency(customer.overdueAmount)}
//                       </span>
//                     ) : (
//                       <span className="text-green-600">$0.00</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCreditStatusColor(customer.creditStatus)}`}>
//                       {customer.creditStatus.replace('_', ' ')}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {customer.lastPayment}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       onClick={() => setSelectedCustomer(customer)}
//                       className="text-emerald-600 hover:text-emerald-900 mr-3"
//                     >
//                       <Eye size={16} />
//                     </button>
//                     <button className="text-blue-600 hover:text-blue-900">
//                       <Edit size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default APOverviewTab;



import React from 'react';
import { Search, Plus, Eye, Edit, Mail, Phone } from 'lucide-react';
import { parseLocalDate } from './AccountsReceivableUtils/formatters';

const APOverviewTab = ({ 
  filters, 
  setFilters, 
  filteredCustomers, 
  setSelectedCustomer,
  setShowInvoiceForm 
}) => {

  // Filter customers based on lastPayment date
  const filteredCustomersByPaymentDate = filteredCustomers.filter((customer) => {
    if (!customer.lastPayment) return true; // include if no payment

    const paymentDate = parseLocalDate(customer.lastPayment);
    const from = parseLocalDate(filters.fromDate);
    const to = parseLocalDate(filters.toDate);

    if (from && paymentDate < from) return false;

    if (to) {
      const endOfTo = new Date(to);
      endOfTo.setHours(23, 59, 59, 999);
      if (paymentDate > endOfTo) return false;
    }

    return true;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search customers..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* From Date */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={filters.fromDate || ''}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={filters.toDate || ''}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* New Invoice */}
        <button
          onClick={() => setShowInvoiceForm(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>New Invoice</span>
        </button>

        {/* Clear Dates Button */}
        {(filters.fromDate || filters.toDate) && (
          <button
            onClick={() => setFilters({ ...filters, fromDate: '', toDate: '' })}
            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
          >
            Clear Dates
          </button>
        )}
      </div>

      {/* Customer List Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomersByPaymentDate.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {customer.email || 'No email'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {customer.phone || 'No phone'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.lastPayment || 'No payment yet'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="text-emerald-600 hover:text-emerald-900 mr-3"
                      title="View customer details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default APOverviewTab;