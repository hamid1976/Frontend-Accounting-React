// API Configuration
const API_BASE_URL_SALES = 'https://api-pos.hulmsolutions.com/POS/accountinghamid/bea876f9-b274-4cd2-9f86-d28953bee69d/orders?start=0&size=200';
const API_CUSTOMERS = 'https://api-pos.hulmsolutions.com/POS/accountinghamid/bea876f9-b274-4cd2-9f86-d28953bee69d/customers?status=Active';

// Replace with your actual Bearer token
const BEARER_TOKEN = 'your-bearer-token-here';

export const fetchSales = async (setSales) => {
  setSales(prev => ({ ...prev, loading: true, error: null }));
  try {
    const response = await fetch(API_BASE_URL_SALES, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const allData = await response.json();
    setSales({ loading: false, data: allData, error: null });
    return allData;
  } catch (error) {
    console.error('Error fetching sales:', error);
    setSales({ loading: false, data: [], error: error.message });
    return null;
  }
};

export const fetchCustomers = async (setCustomers, allSalesData) => {
  setCustomers(prev => ({ ...prev, loading: true, error: null }));
  try {
    const response = await fetch(API_CUSTOMERS, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform API customers to match our structure with real calculated data
    const transformedCustomers = data.map(customer => {
      // Get ALL orders for this customer (not just filtered ones)
      const customerOrders = allSalesData.filter(order => order.customerId === customer.id);
     
      // Calculate total owed from ALL unpaid orders
      const totalOwed = customerOrders
        .filter(order => !order.paid)
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      // Overdue amount = total owed (since all unpaid orders need collection)
      const overdueAmount = totalOwed;
      
      // Total number of orders for this customer
      const invoiceCount = customerOrders.length;
      
      // Determine customer type based on actual order history
      let customerType = 'individual';
      const totalSpentFromOrders = customerOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      if (totalSpentFromOrders > 500000) {
        customerType = 'corporate';
      } else if (totalSpentFromOrders > 200000) {
        customerType = 'small_business';
      } else {
        customerType = 'individual';
      }
      
      // Set credit limit based on customer type
      let creditLimit = 25000; // Default for individual
      if (customerType === 'corporate') {
        creditLimit = 500000;
      } else if (customerType === 'small_business') {
        creditLimit = 100000;
      }
      
      // Determine credit status based on payment behavior
      let creditStatus = 'good';
      if (totalOwed === 0) {
        creditStatus = 'excellent';
      } else if (totalOwed > creditLimit * 0.9) {
        creditStatus = 'hold';
      } else if (totalOwed > creditLimit * 0.7) {
        creditStatus = 'watch';
      }
      
      // Get last payment date from most recent paid order
      const paidOrders = customerOrders.filter(o => o.paid);
      const lastPayment = paidOrders.length > 0 ? 
        paidOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt.split('.').slice(0, 3).join('-') :
        'No payments';

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email || 'No email provided',
        phone: customer.phoneNumber || 'No phone provided',
        address: customer.address && customer.address.length > 0 ? 
          (typeof customer.address[0] === 'string' ? customer.address[0] : 'No address provided') : 
          'No address provided',
        customerType: customerType,
        creditLimit: creditLimit,
        paymentTerms: customerType === 'corporate' ? 45 : (customerType === 'small_business' ? 30 : 15),
        totalOwed: totalOwed,
        overdueAmount: overdueAmount,
        lastPayment: lastPayment,
        creditStatus: creditStatus,
        accountBalance: -totalOwed,
        invoiceCount: invoiceCount,
        avgPaymentDays: 30, // Default estimate
        status: customer.status,
        totalSpendOnOrder: customer.totalSpendOnOrder || 0,
        averageOrderValue: customer.averageOrderValue || 0,
        numberOfOrders: customer.numberOfOrders || invoiceCount
      };
    });
    
    setCustomers({ loading: false, data: transformedCustomers, error: null });
  } catch (error) {
    console.error('Error fetching customers:', error);
    setCustomers({ loading: false, data: [], error: error.message });
  }
};


// // API Configuration
// const API_BASE_URL_SALES = 'https://api-pos.hulmsolutions.com/POS/accounting2/31fc8df0-61db-41e5-bb67-070fde367ea1/orders?start=0&size=200';
// const API_CUSTOMERS = 'https://api-pos.hulmsolutions.com/POS/accounting2/31fc8df0-61db-41e5-bb67-070fde367ea1/customers?status=Active';
// const API_ORDER_PAID = 'https://api-pos.hulmsolutions.com/POS/accounting2/31fc8df0-61db-41e5-bb67-070fde367ea1/orders/Paid';

// // Replace with your actual Bearer token (or load from localStorage/sessionStorage)
// const BEARER_TOKEN = 'your-bearer-token-here';

// // =====================
// // Fetch Sales
// // =====================
// export const fetchSales = async (setSales) => {
//   setSales(prev => ({ ...prev, loading: true, error: null }));
//   try {
//     const response = await fetch(API_BASE_URL_SALES, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${BEARER_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//     });
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const allData = await response.json();
//     setSales({ loading: false, data: allData, error: null });
//     return allData;
//   } catch (error) {
//     console.error('Error fetching sales:', error);
//     setSales({ loading: false, data: [], error: error.message });
//     return null;
//   }
// };

// // =====================
// // Fetch Customers
// // =====================
// export const fetchCustomers = async (setCustomers, allSalesData) => {
//   setCustomers(prev => ({ ...prev, loading: true, error: null }));
//   try {
//     const response = await fetch(API_CUSTOMERS, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${BEARER_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//     });
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     // 🔥 Transform customers (your existing code stays here)
//     const transformedCustomers = data.map(customer => {
//       const customerOrders = allSalesData.filter(order => order.customerId === customer.id);
//       const totalOwed = customerOrders
//         .filter(order => !order.paid)
//         .reduce((sum, order) => sum + (order.total || 0), 0);
//       const overdueAmount = totalOwed;
//       const invoiceCount = customerOrders.length;
      
//       let customerType = 'individual';
//       const totalSpentFromOrders = customerOrders.reduce((sum, order) => sum + (order.total || 0), 0);
//       if (totalSpentFromOrders > 500000) {
//         customerType = 'corporate';
//       } else if (totalSpentFromOrders > 200000) {
//         customerType = 'small_business';
//       }
      
//       let creditLimit = 25000;
//       if (customerType === 'corporate') creditLimit = 500000;
//       else if (customerType === 'small_business') creditLimit = 100000;
      
//       let creditStatus = 'good';
//       if (totalOwed === 0) creditStatus = 'excellent';
//       else if (totalOwed > creditLimit * 0.9) creditStatus = 'hold';
//       else if (totalOwed > creditLimit * 0.7) creditStatus = 'watch';
      
//       const paidOrders = customerOrders.filter(o => o.paid);
//       const lastPayment = paidOrders.length > 0 ? 
//         paidOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt.split('.').slice(0, 3).join('-') :
//         'No payments';

//       return {
//         id: customer.id,
//         name: customer.name,
//         email: customer.email || 'No email provided',
//         phone: customer.phoneNumber || 'No phone provided',
//         address: customer.address && customer.address.length > 0 ? 
//           (typeof customer.address[0] === 'string' ? customer.address[0] : 'No address provided') : 
//           'No address provided',
//         customerType,
//         creditLimit,
//         paymentTerms: customerType === 'corporate' ? 45 : (customerType === 'small_business' ? 30 : 15),
//         totalOwed,
//         overdueAmount,
//         lastPayment,
//         creditStatus,
//         accountBalance: -totalOwed,
//         invoiceCount,
//         avgPaymentDays: 30,
//         status: customer.status,
//         totalSpendOnOrder: customer.totalSpendOnOrder || 0,
//         averageOrderValue: customer.averageOrderValue || 0,
//         numberOfOrders: customer.numberOfOrders || invoiceCount
//       };
//     });
    
//     setCustomers({ loading: false, data: transformedCustomers, error: null });
//   } catch (error) {
//     console.error('Error fetching customers:', error);
//     setCustomers({ loading: false, data: [], error: error.message });
//   }
// };

// // =====================
// // ✅ Update Invoice Paid
// // =====================
// export const updateInvoicePaid = async (invoiceId, payload) => {
//   try {
//     const response = await fetch(`${API_ORDER_PAID}/${invoiceId}`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${BEARER_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
      
//     });
  
//     if (!response.ok) {
//       throw new Error(`Failed to update invoice: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error updating invoice:', error);
//     return null;
//   }
// };
