// // src/components/AccountsPayable/APPurchaseOrdersTab.jsx
// import React from 'react';
// import { Eye, Search, X, Filter } from 'lucide-react';
// import { 
//   createAllVendorPOMapping, 
//   getProductDetails, 
//   getPOStatusColor, 
//   getPOOverallStatus,
//   formatCurrency 
// } from '../../utils/apCalculations';

// const APPurchaseOrdersTab = ({ purchaseOrders, vendors, products, onPOSelect, filters, setFilters }) => {
//   // Get all valid purchase orders first
// const vendorPOData = createAllVendorPOMapping(purchaseOrders, vendors);
// const allValidPurchaseOrders = [];

// vendorPOData.forEach(({ vendor, purchaseOrders: vendorPOs }) => {
//   vendorPOs.forEach(po => {
//     allValidPurchaseOrders.push({
//       ...po,
//       vendorName: vendor?.name?.trim() 
//         ? vendor.name 
//         : `Unnamed Vendor (${vendor?.id || 'N/A'})` // 👈 fallback if no name
//     });
//   });
// });




//   // Apply filters to the purchase orders
//   const filteredPurchaseOrders = allValidPurchaseOrders.filter(po => {
//     const poTotal = po.purchaseOrderItems?.reduce(
//       (sum, item) => {
//         const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
//         return sum + itemTotal;
//       }, 
//       0
//     ) || 0;
    
//     const overallStatus = getPOOverallStatus(po);

//     // Search filter
//     if (filters.searchTerm) {
//       const term = filters.searchTerm.toLowerCase();
//       const poMatch = po.POID?.toString().toLowerCase().includes(term) ||
//                      po.id?.toString().toLowerCase().includes(term) ||
//                      po.remarks?.toLowerCase().includes(term);
      
//       const vendorMatch = po.vendorName?.toLowerCase().includes(term);
      
//       const productMatch = po.purchaseOrderItems?.some(item => {
//         const product = getProductDetails(item.product_Id);
//         return product?.name?.toLowerCase().includes(term);
//       });

//       if (!poMatch && !vendorMatch && !productMatch) {
//         return false;
//       }
//     }

//     // Status filter
//     if (filters.status !== 'all') {
//       if (overallStatus !== filters.status) {
//         return false;
//       }
//     }

//     // Amount filter
//     if (filters.amountRange !== 'all') {
//       switch (filters.amountRange) {
//         case 'small':
//           if (poTotal > 100000) return false;
//           break;
//         case 'medium':
//           if (poTotal <= 100000 || poTotal > 500000) return false;
//           break;
//         case 'large':
//           if (poTotal <= 500000) return false;
//           break;
//         default:
//           break;
//       }
//     }

    

//     return true;
//   });

//   const validPurchaseOrders = filteredPurchaseOrders;

//   const clearFilter = (filterKey) => {
//     setFilters({ ...filters, [filterKey]: 'all' });
//   };

//   const clearSearch = () => {
//     setFilters({ ...filters, searchTerm: '' });
//   };

//   const hasActiveFilters = filters.status !== 'all' || 
//                           filters.amountRange !== 'all' || 
//                           filters.searchTerm !== '';

//   return (
//     <div>
//       {/* Filters for Purchase Orders */}
//       <div className="bg-gray-50 p-4 rounded-lg mb-6">
//         <div className="flex flex-wrap items-center gap-4 mb-4">
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//             <input
//               type="text"
//               placeholder="Search POs, vendors, products..."
//               value={filters.searchTerm}
//               onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
//               className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent w-64"
//             />
//             {filters.searchTerm && (
//               <button
//                 onClick={clearSearch}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>

//           {/* Status Filter */}
//           <div className="relative">
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white pr-8"
//             >
//               <option value="all">All Statuses</option>
//               <option value="pending">Pending</option>
//               <option value="partial">Partial</option>
//               <option value="applied">Applied</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//             {filters.status !== 'all' && (
//               <button
//                 onClick={() => clearFilter('status')}
//                 className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           {/* Amount Filter */}
//           <div className="relative">
//             <select
//               value={filters.amountRange}
//               onChange={(e) => setFilters({ ...filters, amountRange: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white pr-8"
//             >
//               <option value="all">All Amounts</option>
//               <option value="small">Small (≤ 100K)</option>
//               <option value="medium">Medium (100K - 500K)</option>
//               <option value="large">Large (> 500K)</option>
//             </select>
//             {filters.amountRange !== 'all' && (
//               <button
//                 onClick={() => clearFilter('amountRange')}
//                 className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           {hasActiveFilters && (
//             <button
//               onClick={() => setFilters({
//                 ...filters,
//                 status: 'all',
//                 amountRange: 'all',
//                 searchTerm: ''
//               })}
//               className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
//             >
//               <X size={16} />
//               <span>Clear Filters</span>
//             </button>
//           )}
//         </div>

//         {/* Active Filters Display */}
//         {hasActiveFilters && (
//           <div className="flex flex-wrap gap-2">
//             <span className="text-sm text-gray-600">Active filters:</span>
//             {filters.status !== 'all' && (
//               <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs flex items-center gap-1">
//                 Status: {filters.status}
//                 <button onClick={() => clearFilter('status')} className="hover:text-green-600">
//                   <X size={12} />
//                 </button>
//               </span>
//             )}
//             {filters.amountRange !== 'all' && (
//               <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs flex items-center gap-1">
//                 Amount: {filters.amountRange}
//                 <button onClick={() => clearFilter('amountRange')} className="hover:text-purple-600">
//                   <X size={12} />
//                 </button>
//               </span>
//             )}
//             {filters.searchTerm && (
//               <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs flex items-center gap-1">
//                 Search: "{filters.searchTerm}"
//                 <button onClick={clearSearch} className="hover:text-yellow-600">
//                   <X size={12} />
//                 </button>
//               </span>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Results Info */}
//       <div className="mb-4 text-sm text-gray-600">
//         Showing {purchaseOrders.data.length} purchase orders
//         {hasActiveFilters && (
//           <span className="ml-2 text-rose-600">
//             (filtered)
//           </span>
//         )}
//       </div>

//       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">
//             All Purchase Orders ({validPurchaseOrders.length})
//           </h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   PO #
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Vendor
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Products
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Total Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Remarks
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {validPurchaseOrders.map((po) => {
//                 const poTotal = po.purchaseOrderItems?.reduce(
//                   (sum, item) => {
//                     const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
//                     return sum + itemTotal;
//                   }, 
//                   0
//                 ) || 0;
                
//                 return (
//                   <tr key={po.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">#{po.id}</div>
//                       <div className="text-xs text-gray-500">PO-{po.POID}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-medium text-gray-900">
//                         {po.vendorName} {/* Use the vendor name we attached to the PO */}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">
//                         {po.purchaseOrderItems?.map((item, index) => {
//                           const product = getProductDetails(item.product_Id);
//                           return (
//                             <div key={index} className="mb-1">
//                               <span className="font-medium">{product.name}</span>
//                               <span className="text-gray-500 ml-2">x{item.quantity}</span>
//                               <span className={`ml-2 px-1 py-0.5 text-xs rounded ${getPOStatusColor(item.status)}`}>
//                                 {item.status}
//                               </span>
//                               {product.description && (
//                                 <span className="text-xs text-gray-400 ml-2">
//                                   ({product.description})
//                                 </span>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {formatCurrency(poTotal)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPOStatusColor(getPOOverallStatus(po))}`}>
//                         {getPOOverallStatus(po)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900">
//                       {po.remarks || 'No remarks'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button
//                         onClick={() => onPOSelect(po)}
//                         className="text-rose-600 hover:text-rose-900 mr-3"
//                         title="View Details"
//                       >
//                         <Eye size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
              
//               {validPurchaseOrders.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
//                     {hasActiveFilters 
//                       ? 'No purchase orders match your filters' 
//                       : 'No purchase orders found with valid vendors.'
//                     }
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {purchaseOrders.data.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-500 text-lg">
//               {hasActiveFilters ? 'No purchase orders match your filters' : 'No purchase orders found'}
//             </div>
//             <p className="text-gray-400 mt-2">
//               {hasActiveFilters ? 'Try adjusting your search criteria' : 'No purchase order data available'}
//             </p>
//             {hasActiveFilters && (
//               <button
//                 onClick={() => setFilters({
//                   ...filters,
//                   status: 'all',
//                   amountRange: 'all',
//                   searchTerm: ''
//                 })}
//                 className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
//               >
//                 Clear All Filters
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default APPurchaseOrdersTab;

//correct
// src/components/AccountsPayable/APPurchaseOrdersTab.jsx
import React from 'react';
import { Eye, Search, X } from 'lucide-react';
import { 
  createAllVendorPOMapping, 
  getProductDetails, 
  getPOStatusColor, 
  getPOOverallStatus,
  formatCurrency 
} from '../AccountsPayable/AccountPayableUtil/apCalculations';

const APPurchaseOrdersTab = ({ purchaseOrders, vendors, products, onPOSelect, filters, setFilters }) => {
  // ✅ Build vendor-PO mapping
  const vendorPOData = createAllVendorPOMapping(purchaseOrders, vendors);
  const allValidPurchaseOrders = [];

  vendorPOData.forEach(({ vendor, purchaseOrders: vendorPOs }) => {
    vendorPOs.forEach(po => {
      allValidPurchaseOrders.push({
        ...po,
        vendorId: vendor?.id || null,
        vendorName: vendor?.name?.trim() 
          ? vendor.name 
          : `Unnamed Vendor (${vendor?.id || 'N/A'})`
      });
    });
  });

  // ✅ Apply filters
  const filteredPurchaseOrders = allValidPurchaseOrders.filter(po => {
    const poTotal = po.purchaseOrderItems?.reduce(
      (sum, item) => sum + ((item.quantity || 0) * (item.pricePerUnit || 0)), 
      0
    ) || 0;
    
    const overallStatus = getPOOverallStatus(po);

    // Search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const poMatch = po.POID?.toString().toLowerCase().includes(term) ||
                     po.id?.toString().toLowerCase().includes(term) ||
                     po.remarks?.toLowerCase().includes(term);
      const vendorMatch = po.vendorName?.toLowerCase().includes(term);
      const productMatch = po.purchaseOrderItems?.some(item => {
        const product = getProductDetails(item.product_Id);
        return product?.name?.toLowerCase().includes(term);
      });
      if (!poMatch && !vendorMatch && !productMatch) return false;
    }

    // Status filter
    if (filters.status !== 'all' && overallStatus !== filters.status) {
      return false;
    }

    // Amount filter
    if (filters.amountRange !== 'all') {
      if (filters.amountRange === 'small' && poTotal > 100000) return false;
      if (filters.amountRange === 'medium' && (poTotal <= 100000 || poTotal > 500000)) return false;
      if (filters.amountRange === 'large' && poTotal <= 500000) return false;
    }

    // ✅ Vendor filter
    if (filters.vendorId && filters.vendorId !== 'all') {
      if (po.vendorId?.toString() !== filters.vendorId.toString()) {
        return false;
      }
    }

    return true;
  });

  const validPurchaseOrders = filteredPurchaseOrders;

  const clearFilter = (filterKey) => {
    setFilters({ ...filters, [filterKey]: 'all' });
  };
  const clearSearch = () => {
    setFilters({ ...filters, searchTerm: '' });
  };

  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.amountRange !== 'all' || 
    filters.vendorId !== 'all' || 
    filters.searchTerm !== '';

  return (
    <div>
      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search POs, vendors, products..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent w-64"
            />
            {filters.searchTerm && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white pr-8"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="applied">Applied</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {filters.status !== 'all' && (
              <button onClick={() => clearFilter('status')} className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Amount Filter */}
          <div className="relative">
            <select
              value={filters.amountRange}
              onChange={(e) => setFilters({ ...filters, amountRange: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white pr-8"
            >
              <option value="all">All Amounts</option>
              <option value="small">Small (≤ 100K)</option>
              <option value="medium">Medium (100K - 500K)</option>
              <option value="large">Large (> 500K)</option>
            </select>
            {filters.amountRange !== 'all' && (
              <button onClick={() => clearFilter('amountRange')} className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* ✅ Vendor Filter */}
          <div className="relative">
            <select
              value={filters.vendorId || 'all'}
              onChange={(e) => setFilters({ ...filters, vendorId: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white pr-8"
            >
              <option value="all">All Vendors</option>
              {vendors?.data?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name || `Unnamed Vendor (${v.id})`}
                </option>
              ))}
            </select>
            {filters.vendorId && filters.vendorId !== 'all' && (
              <button onClick={() => clearFilter('vendorId')} className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Clear All */}
          {hasActiveFilters && (
            <button
              onClick={() => setFilters({ ...filters, status: 'all', amountRange: 'all', vendorId: 'all', searchTerm: '' })}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
            >
              <X size={16} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            All Purchase Orders ({validPurchaseOrders.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {validPurchaseOrders.map((po) => {
                const poTotal = po.purchaseOrderItems?.reduce(
                  (sum, item) => sum + ((item.quantity || 0) * (item.pricePerUnit || 0)), 
                  0
                ) || 0;

                return (
                  <tr key={po.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">#{po.id}</div>
                      <div className="text-xs text-gray-500">PO-{po.POID}</div>
                    </td>
                    <td className="px-6 py-4">{po.vendorName}</td>
                    <td className="px-6 py-4">
                      {po.purchaseOrderItems?.map((item, idx) => {
                        const product = getProductDetails(item.product_Id);
                        return (
                          <div key={idx} className="text-sm">
                            {product?.name} ×{item.quantity}
                          </div>
                        );
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{formatCurrency(poTotal)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPOStatusColor(getPOOverallStatus(po))}`}>
                        {getPOOverallStatus(po)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{po.remarks || '—'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => onPOSelect(po)} className="text-rose-600 hover:text-rose-900">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {validPurchaseOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No purchase orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default APPurchaseOrdersTab;



// // src/components/AccountsPayable/APPurchaseOrdersTab.jsx
// import React from 'react';
// import { Eye, Search, X } from 'lucide-react';
// import { 
//   createAllVendorPOMapping, 
//   getProductDetails, 
//   getPOStatusColor, 
//   getPOOverallStatus,
//   formatCurrency 
// } from './AccountPayableUtil/apCalculations';

// const APPurchaseOrdersTab = ({ purchaseOrders, vendors, products, onPOSelect, filters, setFilters }) => {
//   // ✅ Build vendor-PO mapping
//   const vendorPOData = createAllVendorPOMapping(purchaseOrders, vendors);
//   const allValidPurchaseOrders = [];

//   vendorPOData.forEach(({ vendor, purchaseOrders: vendorPOs }) => {
//     vendorPOs.forEach(po => {
//       allValidPurchaseOrders.push({
//         ...po,
//         vendorId: vendor?.id || null,
//         vendorName: vendor?.name?.trim() 
//           ? vendor.name 
//           : `Unnamed Vendor (${vendor?.id || 'N/A'})`
//       });
//     });
//   });

//   // ✅ Apply filters
//   const filteredPurchaseOrders = allValidPurchaseOrders.filter(po => {
//     const poTotal = po.purchaseOrderItems?.reduce(
//       (sum, item) => sum + ((item.quantity || 0) * (item.pricePerUnit || 0)), 
//       0
//     ) || 0;
    
//     const overallStatus = getPOOverallStatus(po);

//     // Search filter
//     if (filters.searchTerm) {
//       const term = filters.searchTerm.toLowerCase();
//       const poMatch = po.POID?.toString().toLowerCase().includes(term) ||
//                      po.id?.toString().toLowerCase().includes(term) ||
//                      po.remarks?.toLowerCase().includes(term);
//       const vendorMatch = po.vendorName?.toLowerCase().includes(term);
//       const productMatch = po.purchaseOrderItems?.some(item => {
//         const product = getProductDetails(item.product_Id);
//         return product?.name?.toLowerCase().includes(term);
//       });
//       if (!poMatch && !vendorMatch && !productMatch) return false;
//     }

//     // Status filter
//     if (filters.status !== 'all' && overallStatus !== filters.status) {
//       return false;
//     }

//     // Amount filter
//     if (filters.amountRange !== 'all') {
//       if (filters.amountRange === 'small' && poTotal > 100000) return false;
//       if (filters.amountRange === 'medium' && (poTotal <= 100000 || poTotal > 500000)) return false;
//       if (filters.amountRange === 'large' && poTotal <= 500000) return false;
//     }

//     // ✅ Vendor filter
//     if (filters.vendorId && filters.vendorId !== 'all') {
//       if (po.vendorId?.toString() !== filters.vendorId.toString()) {
//         return false;
//       }
//     }

//     // ✅ Date range filter
//     if (filters.fromDate || filters.toDate) {
//       const poDate = new Date(po.createdAt); // expects createdAt field
//       if (filters.fromDate && poDate < new Date(filters.fromDate)) return false;
//       if (filters.toDate && poDate > new Date(filters.toDate)) return false;
//     }

//     return true;
//   });

//   const validPurchaseOrders = filteredPurchaseOrders;

//   const clearFilter = (filterKey) => {
//     setFilters({ ...filters, [filterKey]: 'all' });
//   };
//   const clearSearch = () => {
//     setFilters({ ...filters, searchTerm: '' });
//   };
//   const clearDate = () => {
//     setFilters({ ...filters, fromDate: '', toDate: '' });
//   };

//   const hasActiveFilters = 
//     filters.status !== 'all' || 
//     filters.amountRange !== 'all' || 
//     filters.vendorId !== 'all' || 
//     filters.searchTerm !== '' ||
//     filters.fromDate || filters.toDate;

//   return (
//     <div>
//       {/* Filters */}
//       <div className="bg-gray-50 p-4 rounded-lg mb-6">
//         <div className="flex flex-wrap items-center gap-4 mb-4">
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//             <input
//               type="text"
//               placeholder="Search POs, vendors, products..."
//               value={filters.searchTerm}
//               onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
//               className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent w-64"
//             />
//             {filters.searchTerm && (
//               <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                 <X size={16} />
//               </button>
//             )}
//           </div>

//           {/* Status Filter */}
//           <div className="relative">
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white pr-8"
//             >
//               <option value="all">All Statuses</option>
//               <option value="pending">Pending</option>
//               <option value="partial">Partial</option>
//               <option value="applied">Applied</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//             {filters.status !== 'all' && (
//               <button onClick={() => clearFilter('status')} className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           {/* Amount Filter */}
//           <div className="relative">
//             <select
//               value={filters.amountRange}
//               onChange={(e) => setFilters({ ...filters, amountRange: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white pr-8"
//             >
//               <option value="all">All Amounts</option>
//               <option value="small">Small (≤ 100K)</option>
//               <option value="medium">Medium (100K - 500K)</option>
//               <option value="large">Large (> 500K)</option>
//             </select>
//             {filters.amountRange !== 'all' && (
//               <button onClick={() => clearFilter('amountRange')} className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           {/* ✅ Vendor Filter */}
//           <div className="relative">
//             <select
//               value={filters.vendorId || 'all'}
//               onChange={(e) => setFilters({ ...filters, vendorId: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white pr-8"
//             >
//               <option value="all">All Vendors</option>
//               {vendors?.data?.map((v) => (
//                 <option key={v.id} value={v.id}>
//                   {v.name || `Unnamed Vendor (${v.id})`}
//                 </option>
//               ))}
//             </select>
//             {filters.vendorId && filters.vendorId !== 'all' && (
//               <button onClick={() => clearFilter('vendorId')} className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           {/* ✅ Date Range Filter */}
//           <div className="flex items-center gap-2">
//             <input
//               type="date"
//               value={filters.fromDate || ''}
//               onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white"
//             />
//             <span className="text-gray-500">to</span>
//             <input
//               type="date"
//               value={filters.toDate || ''}
//               onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white"
//             />
//             {(filters.fromDate || filters.toDate) && (
//               <button onClick={clearDate} className="text-gray-400 hover:text-gray-600">
//                 <X size={16} />
//               </button>
//             )}
//           </div>

//           {/* Clear All */}
//           {hasActiveFilters && (
//             <button
//               onClick={() => setFilters({ ...filters, status: 'all', amountRange: 'all', vendorId: 'all', searchTerm: '', fromDate: '', toDate: '' })}
//               className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
//             >
//               <X size={16} />
//               <span>Clear Filters</span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Results */}
//       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">
//             All Purchase Orders ({validPurchaseOrders.length})
//           </h3>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">POID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
//                 <th className="px-6 py-3"></th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {validPurchaseOrders.map((po) => {
//                 const poTotal = po.purchaseOrderItems?.reduce(
//                   (sum, item) => sum + ((item.quantity || 0) * (item.pricePerUnit || 0)), 
//                   0
//                 ) || 0;

//                 return (
//                   <tr key={po.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-medium text-gray-900">{po.id}</div>
//                       <div className="text-xs text-gray-500">PO-{po.POID}</div>
//                     </td>
//                     <td className="px-6 py-4">{po.vendorName}</td>
//                     <td className="px-6 py-4">
//                       {po.purchaseOrderItems?.map((item, idx) => {
//                         const product = getProductDetails(item.product_Id);
//                         return (
//                           <div key={idx} className="text-sm">
//                             {product?.name} ×{item.quantity}
//                           </div>
//                         );
//                       })}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium">{formatCurrency(poTotal)}</td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPOStatusColor(getPOOverallStatus(po))}`}>
//                         {getPOOverallStatus(po)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">{po.remarks || '—'}</td>
//                     <td className="px-6 py-4">
//                       <button onClick={() => onPOSelect(po)} className="text-rose-600 hover:text-rose-900">
//                         <Eye size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {validPurchaseOrders.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
//                     No purchase orders match your filters.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default APPurchaseOrdersTab;
