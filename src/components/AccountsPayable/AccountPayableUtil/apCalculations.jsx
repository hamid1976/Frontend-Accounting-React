// src/utils/apCalculations.js

export const combineVendorsWithPurchaseOrders = (vendors, purchaseOrders) => {
  console.log("Starting combineVendorsWithPurchaseOrders function...");
  
  // Create a map for quick vendor lookup
  const vendorMap = new Map();
  
  // First, add all vendors with valid names to the map
  if (vendors && vendors.data && Array.isArray(vendors.data)) {
    vendors.data.forEach(vendor => {
      // Only include vendors with valid names (not null, undefined, empty, or "null")
      if (vendor.name && vendor.name.trim() !== '' && vendor.name !== 'null') {
        vendorMap.set(vendor.id, {
          ...vendor,
          purchaseOrders: []
        });
      }
    });
  }
  
  // Process all valid purchase orders
  if (purchaseOrders && Array.isArray(purchaseOrders)) {
    purchaseOrders.forEach(po => {
      // Handle both string "null" and actual null values
      const vendorId = po.Vendor_Id || po.vendor_Id;
      
      // Only process POs with valid vendor_Id (not null, undefined, empty, or "null")
      if (vendorId && vendorId !== 'null') {
        if (vendorMap.has(vendorId)) {
          // Add PO to existing vendor
          vendorMap.get(vendorId).purchaseOrders.push(po);
        } else {
          // If vendor with valid name doesn't exist, create a placeholder
          const uniqueKey = `${vendorId}_${po.POID || po.id}`;
          
          vendorMap.set(uniqueKey, {
            id: vendorId,
            name: `Vendor ${vendorId}`,
            email: 'unknown@vendor.system',
            phone: '+000-000-0000',
            address: 'Unknown Address',
            vendorType: 'unknown',
            creditLimit: 0,
            paymentTerms: 0,
            lastPayment: 'No payments',
            creditStatus: 'unknown',
            billCount: 1,
            avgPaymentDays: 0,
            status: 'pending',
            type: 'Unknown',
            poId: po.id,
            purchaseOrders: [po]
          });
        }
      }
    });
  }
  
  // Convert the map back to an array and filter to only include vendors with names
  const allVendors = Array.from(vendorMap.values());
  const vendorsWithNames = allVendors.filter(vendor => 
    vendor.name && vendor.name.trim() !== '' && vendor.name !== 'null'
  );
  
  return vendorsWithNames;
};
// utils/apCalculations.js

export const createAllVendorPOMapping = (purchaseOrders, vendors) => {
  console.log('Starting createAllVendorPOMapping function');
  
  const vendorPOMap = new Map();

  // Initialize ALL vendors (even unnamed ones)
  if (vendors && vendors.data && Array.isArray(vendors.data)) {
    vendors.data.forEach(vendor => {
      const vendorName = vendor?.name?.trim() 
        ? vendor.name 
        : `Unnamed Vendor (${vendor?.id || 'N/A'})`;

      vendorPOMap.set(vendor.id, {
        vendor: { ...vendor, name: vendorName }, // 👈 fallback included
        purchaseOrders: []
      });
    });
  }

  // Assign POs to vendors
  if (purchaseOrders && purchaseOrders.data && Array.isArray(purchaseOrders.data)) {
    purchaseOrders.data.forEach(po => {
      if (po.vendor_Id) {
        // If vendor exists, push PO; otherwise create a new "Unknown Vendor"
        if (vendorPOMap.has(po.vendor_Id)) {
          vendorPOMap.get(po.vendor_Id).purchaseOrders.push(po);
        } else {
          const fallbackName = `Guest Vendor (${po.vendor_Id})`;
          vendorPOMap.set(po.vendor_Id, {
            vendor: { id: po.vendor_Id, name: fallbackName },
            purchaseOrders: [po]
          });
        }
      }
    });
  }

  return Array.from(vendorPOMap.values());
};

export const createVendorPOMapping = (purchaseOrders, vendors) => {
  console.log('Starting createVendorPOMapping function');
  console.log('Input vendors:', vendors);
  console.log('Input purchaseOrders:', purchaseOrders);
  
  const vendorPOMap = new Map();
  
  // Only initialize vendors with valid names
  if (vendors && vendors.data && Array.isArray(vendors.data)) {
    console.log(`Processing ${vendors.data.length} vendors`);
    
    let validVendorCount = 0;
    let invalidVendorCount = 0;
    
    vendors.data.forEach(vendor => {
      // Check if vendor has a valid name (not null, undefined, or empty)
      if (vendor.name && vendor.name.trim() !== '') {
        vendorPOMap.set(vendor.id, {
          vendor,
          purchaseOrders: []
        });
        validVendorCount++;
        console.log(`Added vendor: ID=${vendor.id}, Name=${vendor.name}`);
      } else {
        invalidVendorCount++;
        console.log(`Skipped vendor with invalid name: ID=${vendor.id}, Name=${vendor.name}`);
      }
    });
    
    console.log(`Valid vendors added: ${validVendorCount}`);
    console.log(`Invalid vendors skipped: ${invalidVendorCount}`);
  } else {
    console.warn('No valid vendors data found');
  }
  
  // Process purchase orders and assign them to vendors with valid names
  if (purchaseOrders && purchaseOrders.data && Array.isArray(purchaseOrders.data)) {
    console.log(`Processing ${purchaseOrders.data.length} purchase orders`);
    
    let assignedPOCount = 0;
    let skippedPOCount = 0;
    
    purchaseOrders.data.forEach(po => {
      // Only process POs with a valid vendor_Id that maps to a vendor with a name
      if (po.vendor_Id && vendorPOMap.has(po.vendor_Id)) {
        vendorPOMap.get(po.vendor_Id).purchaseOrders.push(po);
        assignedPOCount++;
        console.log(`Assigned PO ${po.id || po.POID} to vendor ${po.vendor_Id}`);
      } else {
        skippedPOCount++;
        console.log(`Skipped PO ${po.id || po.POID}, vendor_Id=${po.vendor_Id} (not found in valid vendors)`);
      }
    });
    
    console.log(`POs assigned to vendors: ${assignedPOCount}`);
    console.log(`POs skipped: ${skippedPOCount}`);
  } else {
    console.warn('No valid purchase orders data found');
  }
  
  // Convert the map to an array of vendor-PO pairs
  const result = Array.from(vendorPOMap.values());
  console.log(`\nFinal result: ${result.length} vendor entries with their purchase orders`);
  
  return result;
};

export const calculateAPSummary = (vendors, purchaseOrders) => {
  console.log("Starting AP Summary calculation...");
  
  // Get all vendors with their purchase orders (including applied ones)
  const allVendorsWithPOs = combineVendorsWithPurchaseOrders(vendors, purchaseOrders.data);
  console.log(`Total vendors: ${allVendorsWithPOs.length}`);
  
  // Calculate total amounts from purchase orders
  console.log("Calculating total AP from purchase orders...");
  // let totalAP = 0;
  // let totalOverdue = 0;
  // let vendorsWithBalance = 0;
  
  // allVendorsWithPOs.forEach(vendor => {
  //   console.log(`Processing vendor: ${vendor.name || 'Unknown Vendor'}`);
    
  //   // Calculate vendor's pending amount (only from pending items using quantity × unit price)
  //   const vendorPending = vendor.purchaseOrders.reduce((sum, po) => {
  //     const overallStatus = getPOOverallStatus(po);
      
  //     if (overallStatus === 'applied') {
  //       // Skip fully applied POs
  //       return sum;
  //     } else if (overallStatus === 'partial') {
  //       // For partial POs, only calculate pending items using quantity × unit price
  //       const pendingItemsTotal = po.purchaseOrderItems.reduce((itemSum, item) => {
  //         if (item.status !== 'applied') {
  //           const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
  //           console.log(`PO ${po.POID || po.id} - pending item: ${item.quantity} × ${item.pricePerUnit} = ${itemTotal}`);
  //           return itemSum + itemTotal;
  //         }
  //         return itemSum;
  //       }, 0);
  //       console.log(`PO ${po.POID || po.id} (partial) - pending items total: ${pendingItemsTotal}`);
  //       return sum + pendingItemsTotal;
  //     } else {
  //       // For fully pending POs, calculate all items using quantity × unit price
  //       const poTotal = po.purchaseOrderItems.reduce((poSum, item) => {
  //         const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
  //         console.log(`PO ${po.POID || po.id} - pending item: ${item.quantity} × ${item.pricePerUnit} = ${itemTotal}`);
  //         return poSum + itemTotal;
  //       }, 0);
  //       console.log(`PO ${po.POID || po.id} (${overallStatus}) - full PO total: ${poTotal}`);
  //       return sum + poTotal;
  //     }
  //   }, 0);
    
  //   console.log(`Vendor ${vendor.name} pending amount: ${vendorPending}`);
    
  //   // Add to total AP (which represents total pending)
  //   totalAP += vendorPending;
    
  //   // For overdue calculation, use a percentage of pending orders
  //   const overdueAmount = vendorPending * 0.1; // Example: 10% of pending is overdue
  //   totalOverdue += overdueAmount;
    
  //   if (vendorPending > 0) {
  //     vendorsWithBalance++;
  //   }
  // });
let totalAP = 0;              // ✅ Total Pending Accounts Payable (all vendors, even unnamed)
let vendorsWithBalance = 0;   // Vendors with at least 1 pending amount
let totalOverdue = 0;         // For overdue calculation (example: 10% of pending)

// Track vendor IDs that have pending
const vendorIdsWithPending = new Set();

// Loop over ALL purchase orders (not just mapped vendors)
purchaseOrders.data.forEach(po => {
  const overallStatus = getPOOverallStatus(po);

  let poPending = 0;

  if (overallStatus === 'applied') {
    // fully paid → no pending
    return;
  } else if (overallStatus === 'partial') {
    // only items not applied
    poPending = po.purchaseOrderItems.reduce((itemSum, item) => {
      if (item.status !== 'applied') {
        return itemSum + (item.quantity || 0) * (item.pricePerUnit || 0);
      }
      return itemSum;
    }, 0);
  } else {
    // fully pending PO → take whole PO amount
    poPending = po.purchaseOrderItems.reduce((sum, item) => {
      return sum + (item.quantity || 0) * (item.pricePerUnit || 0);
    }, 0);
  }

  totalAP += poPending;

  if (poPending > 0) {
    vendorIdsWithPending.add(po.vendor_Id || "guest");
  }

  // Example overdue rule: 10% of pending is overdue
  totalOverdue += poPending * 0.1;
});

// ✅ Final metrics
vendorsWithBalance = vendorIdsWithPending.size;

console.log("📊 Accounts Payable Summary");
console.log(`Total A/P (pending only): Rs ${totalAP.toLocaleString()}`);
console.log(`Vendors with pending amounts: ${vendorsWithBalance}`);
console.log(`Total Overdue (10% rule): Rs ${totalOverdue.toLocaleString()}`);
console.log(`Active Vendors: ${allVendorsWithPOs.length}`);

  let totalDaysOutstanding = 0;
  let poCount = 0;
  
  allVendorsWithPOs.forEach(vendor => {
    vendor.purchaseOrders.forEach(po => {
      console.log(`Processing PO: ${po.POID || po.id}`);
      const overallStatus = getPOOverallStatus(po);
      console.log(`Overall status: ${overallStatus}`)
      // Calculate days based on overall status
      let days = 0;
      switch(overallStatus) {
        case 'pending':
          days = 5;
          break;
        case 'Processing':
          days = 10;
          break;
        case 'Shipped':
          days = 20;
          break;
        case 'Delivered':
          days = 30;
          break;
        case 'applied':
          days = 0; // Applied orders don't contribute to days outstanding
          break;
        case 'partial':
          days = 3; // Partially applied orders have fewer outstanding days
          break;
        default:
          days = 15;
      }
      
      console.log(`Adding ${days} days for PO ${po.POID || po.id} with status ${overallStatus}`);
      totalDaysOutstanding += days;
      if (days > 0) poCount++; // Only count POs that contribute to days outstanding
    });
  });
  
  const avgDaysOutstanding = poCount > 0 ? Math.round(totalDaysOutstanding / poCount) : 0;
  console.log(`Average days outstanding: ${avgDaysOutstanding}`);

  console.log("AP Summary calculation completed");
  
  return {
    totalAP,
    totalOverdue,
    vendorsWithBalance,
    avgDaysOutstanding
  };
};

export const getProductDetails = (productId) => {
  if (!productId) return { name: 'Unknown Product', description: '', price: 0 };
  
  const product = (window.productsData || []).find(p => 
    p.id === productId || p.id === String(productId)
  );
  
  if (product) {
    return {
      name: product.name || 'Unknown Product',
      description: product.description || '',
      price: product.price || 0,
      costPrice: product.costPrice || 0,
      quantity: product.quantity || 0
    };
  }
  
  return { name: `Product #${productId}`, description: '', price: 0 };
};

export const getVendorName = (vendorId, vendorsData) => {
  if (!vendorId || vendorId === 'null') return 'Unknown Vendor';
  const vendor = vendorsData.find(v => v.id === vendorId);
  return vendor ? vendor.name : 'Unknown Vendor';
};

export const getCreditStatusColor = (status) => {
  switch (status) {
    case 'excellent': return 'bg-green-100 text-green-800';
    case 'good': return 'bg-blue-100 text-blue-800';
    case 'watch': return 'bg-yellow-100 text-yellow-800';
    case 'hold': return 'bg-red-100 text-red-800';
    case 'unknown': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getPOStatusColor = (status) => {
  switch (status) {
    case 'applied': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'partial': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// export const getPOOverallStatus = (purchaseOrder) => {
//   if (!purchaseOrder.purchaseOrderItems || purchaseOrder.purchaseOrderItems.length === 0) {
//     return purchaseOrder.status || 'pending';
//   }
  
//   // Check if all items are applied
//   const allItemsApplied = purchaseOrder.purchaseOrderItems.every(item => 
//     item.status === 'applied'
//   );
  
//   if (allItemsApplied) {
//     return 'applied';
//   }
  
//   // Check if any items are applied (mixed status)
//   const someItemsApplied = purchaseOrder.purchaseOrderItems.some(item => 
//     item.status === 'applied'
//   );
  
//   if (someItemsApplied) {
//     return 'partial'; // You can create a new status for partially applied POs
//   }
  
//   // Default to the PO level status or pending
//   return purchaseOrder.status || 'pending';
// };

// utils/apCalculations.js

export function getPOOverallStatus(po) {
  if (!po || !po.purchaseOrderItems) return "pending";

  const statuses = po.purchaseOrderItems.map(item => item.status);

  if (statuses.every(s => s === "applied")) {
    return "applied";
  }
  if (statuses.every(s => s === "pending")) {
    return "pending";
  }
  return "partial"; // mix of applied + pending
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};