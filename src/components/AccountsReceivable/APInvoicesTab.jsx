// import React from 'react';
// import { Eye, Download } from 'lucide-react';
// import { formatCurrency, formatDate } from './AccountsReceivableUtils/formatters';

// const APInvoicesTab = ({ filters, setFilters, filteredOrders, getCustomerName, setViewInvoice }) => {
//   return (
//     <div>
//       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
//         </div>

//         {/* Filters Bar */}
//         <div className="flex flex-wrap items-end gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
//           {/* From Date */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
//             <input
//               type="date"
//               value={filters.fromDate}
//               onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//             />
//           </div>

//           {/* To Date */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
//             <input
//               type="date"
//               value={filters.toDate}
//               onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//             />
//           </div>

//           {/* Status */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//             >
//               <option value="all">All</option>
//               <option value="paid">Paid</option>
//               <option value="unpaid">Unpaid</option>
//               <option value="fulfilled">Fulfilled</option>
//               <option value="unfulfilled">Unfulfilled</option>
//             </select>
//           </div>

//           {/* Search */}
//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
//             <input
//               type="text"
//               placeholder="Search by Order # or Customer"
//               value={filters.searchTerm}
//               onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   ORDERID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Payment Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Fulfillment
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Sales Order
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredOrders.map((order) => (
//                 <tr key={order.orderId} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
//                     <div className="text-xs text-gray-500">{order.status}</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-medium text-gray-900">{getCustomerName(order.customerId)}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {formatDate(order.createdAt)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {formatCurrency(order.total)}
//                   </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`px-2 py-1 text-xs font-medium rounded-full ${
//                       order.paid || order.paymentStatus === 'paid'
//                         ? 'bg-green-100 text-green-800'
//                         : order.paymentStatus === 'partial'
//                         ? 'bg-orange-100 text-orange-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}
//                   >
//                     {order.paid || order.paymentStatus === 'paid'
//                       ? 'Paid'
//                       : order.paymentStatus === 'partial'
//                       ? `Partial (${formatCurrency(order.remainingAmount)} left)`
//                       : 'Unpaid'}
//                   </span>
//                 </td>


//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 py-1 text-xs font-medium rounded-full ${
//                         order.fulfilled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                       }`}
//                     >
//                       {order.fulfilled ? 'Fulfilled' : 'Unfulfilled'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       className="text-emerald-600 hover:text-emerald-900 mr-3"
//                       onClick={() => setViewInvoice(order)}
//                     >
//                       <Eye size={16} />
//                     </button>
//                     <button className="text-blue-600 hover:text-blue-900">
//                       <Download size={16} />
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

// export default APInvoicesTab;


import React from 'react';
import { Eye, Download } from 'lucide-react';
import { formatCurrency, formatDate } from './AccountsReceivableUtils/formatters';

const APInvoicesTab = ({ filters, setFilters, filteredOrders, getCustomerName, setViewInvoice }) => {
  // Build unique customer list
  

  // Apply customer filter
const visibleOrders = filteredOrders.filter((order) => {
  if (filters.customer && filters.customer !== "all") {
    return order.customerId === filters.customer;
  }
  return true;
});
const uniqueCustomers = Array.from(
    new Set(visibleOrders.map((order) => order.customerId))
  ).map((id) => ({
    id,
    name: getCustomerName(id) || 'Unknown Customer',
  }));


  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-end gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          {/* From Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="unfulfilled">Unfulfilled</option>
            </select>
          </div>

          {/* Customer Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Customer</label>
            <select
              value={filters.customer || 'all'}
              onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Customers</option>
              {uniqueCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by Order # or Customer"
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ORDERID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fulfillment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales Order
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visibleOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
                    <div className="text-xs text-gray-500">{order.status}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{getCustomerName(order.customerId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.paid || order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'partial'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.paid || order.paymentStatus === 'paid'
                        ? 'Paid'
                        : order.paymentStatus === 'partial'
                        ? `Partial (${formatCurrency(order.remainingAmount)} left)`
                        : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.fulfilled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.fulfilled ? 'Fulfilled' : 'Unfulfilled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-emerald-600 hover:text-emerald-900 mr-3"
                      onClick={() => setViewInvoice(order)}
                    >
                      <Eye size={16} />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      <Download size={16} />
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

export default APInvoicesTab;
