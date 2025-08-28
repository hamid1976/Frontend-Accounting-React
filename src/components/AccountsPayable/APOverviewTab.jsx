// src/components/AccountsPayable/APOverviewTab.jsx
import React from 'react';
import { Search, RefreshCw, Eye, Filter, X } from 'lucide-react';
import { 
  combineVendorsWithPurchaseOrders, 
  getProductDetails, 
  getPOStatusColor, 
  getPOOverallStatus,
  formatCurrency 
} from './AccountPayableUtil/apCalculations';

const APOverviewTab = ({ 
  filters, 
  setFilters, 
  filteredVendors,  // This should be ALL vendors, not pre-filtered
  purchaseOrders, 
  onVendorSelect, 
  onPOSelect, 
  onRefresh,
}) => {
  // Get all vendors with POs first
  const allVendorsWithPOs = combineVendorsWithPurchaseOrders({ data: filteredVendors }, purchaseOrders.data);
  
  // Apply filters to the vendor data
  const filteredData = allVendorsWithPOs.filter(vendor => {
    const hasPos = vendor.purchaseOrders && vendor.purchaseOrders.length > 0;
    
     // ✅ Date range filter — skip vendor if none of its POs fall in the range
    if (filters.dateFrom || filters.dateTo) {
      const withinRange = vendor.purchaseOrders?.some(po => {
        const poDate = new Date(po.date);
        const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
        const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
        if (fromDate && poDate < fromDate) return false;
        if (toDate && poDate > toDate) return false;
        return true;
      });
      if (!withinRange) return false;
    }

    // Calculate vendor's pending amount for filtering
    const vendorPendingAmount = hasPos 
      ? vendor.purchaseOrders.reduce((sum, po) => {
          const overallStatus = getPOOverallStatus(po);
          
          if (overallStatus === 'applied') {
            return sum; // Skip fully applied POs
          } else if (overallStatus === 'partial') {
            const pendingItemsTotal = po.purchaseOrderItems.reduce((itemSum, item) => {
              if (item.status !== 'applied') {
                const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
                return itemSum + itemTotal;
              }
              return itemSum;
            }, 0);
            return sum + pendingItemsTotal;
          } else {
            const poTotal = po.purchaseOrderItems.reduce((itemSum, item) => {
              const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
              return itemSum + itemTotal;
            }, 0);
            return sum + poTotal;
          }
        }, 0)
      : 0;

    // Search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const vendorMatch = vendor.name.toLowerCase().includes(term);
      
      if (!vendorMatch) {
        return false;
      }
    }

    // Vendor type filter
    if (filters.vendorType !== 'all') {
      if (vendor.type !== filters.vendorType) {
        return false;
      }
    }

    // Status filter
    if (filters.status !== 'all') {
      if (!hasPos && filters.status !== 'no_orders') {
        return false;
      }
      
      if (hasPos) {
        const hasAppliedPOs = vendor.purchaseOrders.some(po => getPOOverallStatus(po) === 'applied');
        const hasPartialPOs = vendor.purchaseOrders.some(po => getPOOverallStatus(po) === 'partial');
        const hasPendingPOs = vendor.purchaseOrders.some(po => getPOOverallStatus(po) === 'pending');

        switch (filters.status) {
          case 'pending':
            if (!hasPendingPOs) return false;
            break;
          case 'applied':
            if (!hasAppliedPOs || vendorPendingAmount > 0) return false;
            break;
          case 'partial':
            if (!hasPartialPOs) return false;
            break;
          case 'paid_up':
            if (vendorPendingAmount > 0) return false;
            break;
          case 'no_orders':
            return false; // Already handled above
          default:
            break;
        }
      }
    }

    // Amount filter
    if (filters.amountRange !== 'all') {
      switch (filters.amountRange) {
        case 'zero':
          if (vendorPendingAmount !== 0) return false;
          break;
        case 'small':
          if (vendorPendingAmount > 100000) return false;
          break;
        case 'medium':
          if (vendorPendingAmount <= 100000 || vendorPendingAmount > 500000) return false;
          break;
        case 'large':
          if (vendorPendingAmount <= 500000) return false;
          break;
        default:
          break;
      }
    } 
   
    // ✅ Vendor dropdown filter
  if (filters.vendorId && filters.vendorId !== "all") {
    if (vendor.id !== filters.vendorId) {
      return false;
    }
  }


    return true;
  });

  

  const vendorsWithPOs = filteredData;

  const clearFilter = (filterKey) => {
    setFilters({ ...filters, [filterKey]: 'all' });
  };

  const clearSearch = () => {
    setFilters({ ...filters, searchTerm: '' });
  };

  const hasActiveFilters = filters.vendorType !== 'all' || 
                          filters.status !== 'all' || 
                          filters.amountRange !== 'all' || 
                          filters.searchTerm !== '';

  return (
    <div>
      {/* Enhanced Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search vendors, POs, products..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent w-64"
            />
            {filters.searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center space-x-2">
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
          </div>

          {/* Vendor Type Filter */}
          <div className="relative">
            <select
              value={filters.vendorType}
              onChange={(e) => setFilters({ ...filters, vendorType: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white pr-8"
            >
              <option value="all">All Vendor Types</option>
              <option value="Individual">Individual</option>
              <option value="Organization">Organization</option>
            </select>
            {filters.vendorType !== 'all' && (
              <button
                onClick={() => clearFilter('vendorType')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white pr-8"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="applied">Applied</option>
              <option value="paid_up">Paid Up</option>
              <option value="no_orders">No Orders</option>
            </select>
            {filters.status !== 'all' && (
              <button
                onClick={() => clearFilter('status')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Amount Range Filter */}
          <div className="relative">
            <select
              value={filters.amountRange}
              onChange={(e) => setFilters({ ...filters, amountRange: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white pr-8"
            >
              <option value="all">All Amounts</option>
              <option value="zero">Zero Amount</option>
              <option value="small">Small (≤ 100K)</option>
              <option value="medium">Medium (100K - 500K)</option>
              <option value="large">Large (> 500K)</option>
            </select>
            {filters.amountRange !== 'all' && (
              <button
                onClick={() => clearFilter('amountRange')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

             <div className="relative">
                  <select
                    value={filters.vendorId}
                    onChange={(e) => setFilters({ ...filters, vendorId: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white pr-8"
                  >
                    <option value="all">All Vendors</option>
                    {filteredVendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                  {filters.vendorId && filters.vendorId !== "all" && (
                    <button
                      onClick={() => setFilters({ ...filters, vendorId: "all" })}
                      className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
          {/* Vendor Filter Dropdown // NEW */}


             

          {/* Action Buttons */}
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={() => setFilters({
                vendorType: 'all',
                status: 'all',
                amountRange: 'all',
                searchTerm: ''
              })}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
            >
              <X size={16} />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.vendorType !== 'all' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs flex items-center gap-1">
                Type: {filters.vendorType}
                <button onClick={() => clearFilter('vendorType')} className="hover:text-blue-600">
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs flex items-center gap-1">
                Status: {filters.status}
                <button onClick={() => clearFilter('status')} className="hover:text-green-600">
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.amountRange !== 'all' && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs flex items-center gap-1">
                Amount: {filters.amountRange}
                <button onClick={() => clearFilter('amountRange')} className="hover:text-purple-600">
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.searchTerm && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs flex items-center gap-1">
                Search: "{filters.searchTerm}"
                <button onClick={clearSearch} className="hover:text-yellow-600">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {vendorsWithPOs.length} of {allVendorsWithPOs.length} vendors
        {hasActiveFilters && (
          <span className="ml-2 text-rose-600">
            (filtered)
          </span>
        )}
      </div>

      {/* Vendor List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Orders
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendorsWithPOs.map((vendor) => {
                const hasPos = vendor.purchaseOrders && vendor.purchaseOrders.length > 0;
                
                // Calculate vendor total - only from pending items using quantity × unit price
                const vendorTotal = hasPos 
                  ? vendor.purchaseOrders.reduce((sum, po) => {
                      const overallStatus = getPOOverallStatus(po);
                      
                      if (overallStatus === 'applied') {
                        return sum; // Skip fully applied POs
                      } else if (overallStatus === 'partial') {
                        // For partial POs, only calculate pending items using quantity × unit price
                        const pendingItemsTotal = po.purchaseOrderItems.reduce((itemSum, item) => {
                          if (item.status !== 'applied') {
                            const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
                            return itemSum + itemTotal;
                          }
                          return itemSum;
                        }, 0);
                        return sum + pendingItemsTotal;
                      } else {
                        // For fully pending POs, calculate all items using quantity × unit price
                        const poTotal = po.purchaseOrderItems.reduce((itemSum, item) => {
                          const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
                          return itemSum + itemTotal;
                        }, 0);
                        return sum + poTotal;
                      }
                    }, 0)
                  : 0;
                
                // Collect all products from all POs for this vendor (only pending items)
                const allProducts = [];
                if (hasPos) {
                  vendor.purchaseOrders.forEach(po => {
                    const overallStatus = getPOOverallStatus(po);
                    if (po.purchaseOrderItems) {
                      po.purchaseOrderItems.forEach(item => {
                        // Only include pending items or items from fully pending POs
                        if (overallStatus === 'pending' || 
                           (overallStatus === 'partial' && item.status !== 'applied')) {
                          const product = getProductDetails(item.product_Id);
                          allProducts.push({
                            poId: po.POID,
                            name: product?.name || "Unknown Product",
                            quantity: item.quantity,
                            description: product?.description,
                            status: item.status
                          });
                        }
                      });
                    }
                  });
                }
                
                // Get all statuses from vendor's POs - use the overall status based on items
                const statusCounts = {};
                if (hasPos) {
                  vendor.purchaseOrders.forEach(po => {
                    const overallStatus = getPOOverallStatus(po);
                    statusCounts[overallStatus] = (statusCounts[overallStatus] || 0) + 1;
                  });
                }
                
                return (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    {/* Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {vendor.name || "Unknown Vendor"}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {vendor.id}
                      </div>
                    </td>
                    
                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {vendor.email || 'No email provided'}
                      </div>
                    </td>
                    
                    {/* Phone */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {vendor.phone || 'No phone provided'}
                      </div>
                    </td>
                    
                    {/* Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {vendor.type || 'Individual'}
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!hasPos ? (
                        <button
                          className="text-gray-400 cursor-not-allowed"
                          title="No actions available"
                          disabled
                        >
                          <Eye size={16} />
                        </button>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => onVendorSelect(vendor)}
                            className="text-blue-600 hover:text-blue-900 mr-1"
                            title="View Vendor Details"
                          >
                            <Eye size={16} />
                          </button>
                          {vendor.purchaseOrders.map((po, index) => (
                            <div key={index} className="flex items-center">
                              <span className="text-xs text-gray-500 mr-1">PO-{po.POID}:</span>
                              <button
                                onClick={() => onPOSelect(po)}
                                className="text-rose-600 hover:text-rose-900 mr-1"
                                title={`View PO-${po.POID} Details`}
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {vendorsWithPOs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {hasActiveFilters ? 'No vendors match your filters' : 'No vendors found'}
            </div>
            <p className="text-gray-400 mt-2">
              {hasActiveFilters ? 'Try adjusting your search criteria' : 'No vendor data available'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => setFilters({
                  vendorType: 'all',
                  status: 'all',
                  amountRange: 'all',
                  searchTerm: ''
                })}
                className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default APOverviewTab;