// src/hooks/useAPFilters.js
import { useState } from 'react';
import { getPOOverallStatus } from '../AccountPayableUtil/apCalculations';

export const useAPFilters = (vendorsData, purchaseOrdersData) => {
  const [filters, setFilters] = useState({
    vendorType: 'all',
    status: 'all',
    searchTerm: '',
    dateRange: 'all',
    amountRange: 'all'
  });

  const getFilteredVendors = () => {
    if (!vendorsData) return [];
    
    let filtered = [...vendorsData];

    // Filter by vendor type
    if (filters.vendorType !== 'all') {
      filtered = filtered.filter(vendor => vendor.vendorType === filters.vendorType);
    }

    // Filter by status - based on actual PO statuses and amounts
    if (filters.status !== 'all') {
      filtered = filtered.filter(vendor => {
        // Get all POs for this vendor
        const vendorPOs = (purchaseOrdersData || []).filter(po => 
          po.vendor_Id === vendor.id || po.Vendor_Id === vendor.id
        );

        if (vendorPOs.length === 0) {
          return filters.status === 'no_orders';
        }

        // Calculate pending amount for this vendor
        const vendorPendingAmount = vendorPOs.reduce((sum, po) => {
          const overallStatus = getPOOverallStatus(po);
          
          if (overallStatus === 'applied') {
            return sum; // Skip fully applied POs
          } else if (overallStatus === 'partial') {
            // For partial POs, only calculate pending items
            const pendingItemsTotal = po.purchaseOrderItems.reduce((itemSum, item) => {
              if (item.status !== 'applied') {
                const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
                return itemSum + itemTotal;
              }
              return itemSum;
            }, 0);
            return sum + pendingItemsTotal;
          } else {
            // For fully pending POs, calculate all items
            const poTotal = po.purchaseOrderItems.reduce((itemSum, item) => {
              const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
              return itemSum + itemTotal;
            }, 0);
            return sum + poTotal;
          }
        }, 0);

        // Check PO statuses
        const hasAppliedPOs = vendorPOs.some(po => getPOOverallStatus(po) === 'applied');
        const hasPendingPOs = vendorPOs.some(po => getPOOverallStatus(po) === 'pending');
        const hasPartialPOs = vendorPOs.some(po => getPOOverallStatus(po) === 'partial');

        switch (filters.status) {
          case 'pending':
            return vendorPendingAmount > 0; // Has any pending amount
          case 'applied':
            return hasAppliedPOs && vendorPendingAmount === 0; // Only applied orders
          case 'partial':
            return hasPartialPOs; // Has partially applied orders
          case 'overdue':
            return vendorPendingAmount > 0; // Same as pending for now
          case 'current':
            return vendorPendingAmount > 0 && !hasPartialPOs; // Pending but not overdue
          case 'paid_up':
            return vendorPendingAmount === 0 && hasAppliedPOs; // All paid
          case 'no_orders':
            return vendorPOs.length === 0;
          default:
            return true;
        }
      });
    }

    // Filter by amount range
    if (filters.amountRange !== 'all') {
      filtered = filtered.filter(vendor => {
        const vendorPOs = (purchaseOrdersData || []).filter(po => 
          po.vendor_Id === vendor.id || po.Vendor_Id === vendor.id
        );

        const vendorPendingAmount = vendorPOs.reduce((sum, po) => {
          const overallStatus = getPOOverallStatus(po);
          
          if (overallStatus === 'applied') {
            return sum;
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
        }, 0);

        switch (filters.amountRange) {
          case 'small':
            return vendorPendingAmount > 0 && vendorPendingAmount <= 100000; // Up to 100k
          case 'medium':
            return vendorPendingAmount > 100000 && vendorPendingAmount <= 500000; // 100k-500k
          case 'large':
            return vendorPendingAmount > 500000; // Above 500k
          case 'zero':
            return vendorPendingAmount === 0;
          default:
            return true;
        }
      });
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(vendor => {
        // Search in vendor details
        const vendorMatch = vendor.name.toLowerCase().includes(term) ||
                           vendor.email.toLowerCase().includes(term) ||
                           vendor.id.toLowerCase().includes(term);

        // Search in PO IDs
        const vendorPOs = (purchaseOrdersData || []).filter(po => 
          po.vendor_Id === vendor.id || po.Vendor_Id === vendor.id
        );
        const poMatch = vendorPOs.some(po => 
          po.POID?.toString().toLowerCase().includes(term) ||
          po.id?.toString().toLowerCase().includes(term) ||
          po.remarks?.toLowerCase().includes(term)
        );

        // Search in product names
        const productMatch = vendorPOs.some(po =>
          po.purchaseOrderItems.some(item => {
            const productName = window.productsData?.find(p => 
              p.id === item.product_Id
            )?.name || '';
            return productName.toLowerCase().includes(term);
          })
        );

        return vendorMatch || poMatch || productMatch;
      });
    }

    return filtered;
  };

  const getFilteredPurchaseOrders = () => {
    if (!purchaseOrdersData) return [];
    
    let filtered = [...purchaseOrdersData];

    // Filter by PO status
    if (filters.status !== 'all') {
      filtered = filtered.filter(po => {
        const overallStatus = getPOOverallStatus(po);
        
        switch (filters.status) {
          case 'pending':
            return overallStatus === 'pending';
          case 'applied':
            return overallStatus === 'applied';
          case 'partial':
            return overallStatus === 'partial';
          case 'cancelled':
            return overallStatus === 'cancelled';
          default:
            return true;
        }
      });
    }

    // Filter by amount range
    if (filters.amountRange !== 'all') {
      filtered = filtered.filter(po => {
        const poTotal = po.purchaseOrderItems.reduce((sum, item) => {
          const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
          return sum + itemTotal;
        }, 0);

        switch (filters.amountRange) {
          case 'small':
            return poTotal <= 100000;
          case 'medium':
            return poTotal > 100000 && poTotal <= 500000;
          case 'large':
            return poTotal > 500000;
          default:
            return true;
        }
      });
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(po => {
        // Search in PO details
        const poMatch = po.POID?.toString().toLowerCase().includes(term) ||
                       po.id?.toString().toLowerCase().includes(term) ||
                       po.remarks?.toLowerCase().includes(term);

        // Search in vendor name
        const vendor = vendorsData?.find(v => v.id === (po.vendor_Id || po.Vendor_Id));
        const vendorMatch = vendor?.name.toLowerCase().includes(term);

        // Search in products
        const productMatch = po.purchaseOrderItems.some(item => {
          const product = window.productsData?.find(p => p.id === item.product_Id);
          return product?.name.toLowerCase().includes(term);
        });

        return poMatch || vendorMatch || productMatch;
      });
    }

    return filtered;
  };

  const resetFilters = () => {
    setFilters({
      vendorType: 'all',
      status: 'all',
      searchTerm: '',
      dateRange: 'all',
      amountRange: 'all'
    });
  };

  const getFilterCounts = () => {
    if (!vendorsData || !purchaseOrdersData) return {};

    const counts = {
      total: vendorsData.length,
      withPendingAmounts: 0,
      fullyApplied: 0,
      partiallyApplied: 0,
      noPurchaseOrders: 0
    };

    vendorsData.forEach(vendor => {
      const vendorPOs = purchaseOrdersData.filter(po => 
        po.vendor_Id === vendor.id || po.Vendor_Id === vendor.id
      );

      if (vendorPOs.length === 0) {
        counts.noPurchaseOrders++;
        return;
      }

      const vendorPendingAmount = vendorPOs.reduce((sum, po) => {
        const overallStatus = getPOOverallStatus(po);
        
        if (overallStatus === 'applied') {
          return sum;
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
      }, 0);

      const hasPartialPOs = vendorPOs.some(po => getPOOverallStatus(po) === 'partial');

      if (vendorPendingAmount > 0) {
        counts.withPendingAmounts++;
        if (hasPartialPOs) {
          counts.partiallyApplied++;
        }
      } else {
        counts.fullyApplied++;
      }
    });

    return counts;
  };

  return {
    filters,
    setFilters,
    getFilteredVendors,
    getFilteredPurchaseOrders,
    resetFilters,
    getFilterCounts
  };
};