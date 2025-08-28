// Calculate AR summary
export const calculateARSummary = (customers, allSalesData) => {
  let totalAR = 0;
  let totalOverdue = 0;
  let totalDaysOutstanding = 0;
  let orderCount = 0;

  // Track named customers with unpaid orders to count them once
  const namedCustomerIdsWithBalance = new Set();
  let customersWithBalance = 0;

  if (allSalesData && Array.isArray(allSalesData)) {
    allSalesData.forEach(order => {
      if (!order.paid) {
        const orderTotal = order.total || 0;
        totalAR += orderTotal;

        if (order.overdueAmount > 0) {
          totalOverdue += order.overdueAmount;
        }

        // Determine if this order belongs to a named customer
        if (order.customerName && order.customerName.trim() !== '') {
          if (!namedCustomerIdsWithBalance.has(order.customerId)) {
            namedCustomerIdsWithBalance.add(order.customerId);
            customersWithBalance++;
          }
        } else {
          // Guest: count each unpaid order separately
          customersWithBalance++;
        }

        // Calculate days outstanding
        const orderDateStr = order.createdAt.split('.').slice(0, 3).join('-'); // "YYYY-MM-DD"
        const orderDate = new Date(orderDateStr);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 3600 * 24));
        totalDaysOutstanding += daysDiff;
        orderCount++;
      }
    });
  }

  const avgDaysOutstanding = orderCount > 0 ? Math.round(totalDaysOutstanding / orderCount) : 0;

  return {
    totalAR,
    totalOverdue,
    customersWithBalance,
    avgDaysOutstanding
  };
};

// Get aging data
export const getAgingData = (salesData) => {
  const aging = {
    current: 0,
    days30: 0,
    days60: 0,
    days90: 0,
    over90: 0
  };

  if (!Array.isArray(salesData)) return aging; // <-- Safety check

  salesData.forEach(order => {
    if (order.paid) return;

    const daysPastDue = order.daysOverdue || 0;
    const amount = parseFloat(order.total?.toString().replace(/[^0-9.-]+/g,"")) || 0;

    if (daysPastDue <= 0) {
      aging.current += amount;
    } else if (daysPastDue <= 30) {
      aging.days30 += amount;
    } else if (daysPastDue <= 60) {
      aging.days60 += amount;
    } else if (daysPastDue <= 90) {
      aging.days90 += amount;
    } else {
      aging.over90 += amount;
    }
  });

  return aging;
};


// Filter customers
export const getFilteredCustomers = (customers, filters) => {
  // First check if we have valid data
  if (!customers || !Array.isArray(customers)) {
    return [];
  }
  
  // Start by filtering ONLY customers WITH names
  let filtered = customers.filter(customer => 
    customer && 
    customer.name && 
    typeof customer.name === 'string' && 
    customer.name.trim() !== ''
  );

  // Now apply the rest of the filters to our name-filtered list
  if (filters && filters.customerType && filters.customerType !== 'all') {
    filtered = filtered.filter(customer => customer.customerType === filters.customerType);
  }

  if (filters && filters.status && filters.status !== 'all') {
    filtered = filtered.filter(customer => {
      if (filters.status === 'overdue') return customer.overdueAmount > 0;
      if (filters.status === 'current') return customer.totalOwed > 0 && customer.overdueAmount === 0;
      if (filters.status === 'paid_up') return customer.totalOwed === 0;
      return true;
    });
  }

  if (filters && filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(customer =>
      customer.name.toLowerCase().includes(term) ||
      (customer.email && customer.email.toLowerCase().includes(term)) ||
      (customer.id && customer.id.toLowerCase().includes(term))
    );
  }

  console.log(`Filtered to ${filtered.length} customers with valid names`);
  return filtered;
};