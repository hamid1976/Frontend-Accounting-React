import { API_CONFIG } from '../../../utils/apiConfig';
import { findAccountByType } from '../../../utils/accountHelpers';

// Fetch sales order data from API
export const fetchSalesOrderData = async () => {
  try {
    const response = await fetch(API_CONFIG.SALES_ORDERS, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Sales API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sales order data:', error);
    return null;
  }
};

// Fetch purchase order data from API
export const fetchPurchaseOrderData = async () => {
  try {
    console.log('Making purchase orders API call to:', API_CONFIG.PURCHASE_ORDERS);
    
    const response = await fetch(API_CONFIG.PURCHASE_ORDERS, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Purchase orders API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Purchase API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Purchase orders API data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching purchase order data:', error);
    return null;
  }
};

// Format date from API format
export const formatDateFromCreatedAt = (createdAt) => {
  try {
    const parts = createdAt.split('.');
    if (parts.length >= 3) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
    return new Date().toISOString().split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
  }
};

// Convert Purchase Order to Journal Entry
export const convertPurchaseOrderToJournalEntry = (purchaseOrder, accountsList) => {
  if (!purchaseOrder || !purchaseOrder.purchaseOrderItems) {
    return null;
  }

  const entries = [];
  
  const appliedItems = purchaseOrder.purchaseOrderItems.filter(item => 
    item.status === 'applied' && item.quantity > 0
  );
  
  if (appliedItems.length === 0) {
    return null;
  }
  
  const totalAmount = appliedItems.reduce((sum, item) => 
    sum + (parseFloat(item.pricePerUnit || 0) * parseFloat(item.quantity || 0)), 0
  );
  
  if (totalAmount <= 0) {
    return null;
  }
  
  const inventoryAccount = findAccountByType(accountsList, 'assets', '19');
  entries.push({
    accountId: inventoryAccount.id,
    accountName: inventoryAccount.name,
    accountCode: inventoryAccount.code,
    debit: totalAmount,
    credit: 0,
    description: `Inventory purchase from PO #${purchaseOrder.id} - ${appliedItems.length} items`
  });
  
  const payableAccount = findAccountByType(accountsList, 'liabilities', '28');
  entries.push({
    accountId: payableAccount.id,
    accountName: payableAccount.name,
    accountCode: payableAccount.code,
    debit: 0,
    credit: totalAmount,
    description: `Amount owed for PO #${purchaseOrder.id} - ${purchaseOrder.remarks || 'Purchase order'}`
  });
  
  return {
    id: `POID-${purchaseOrder.id}`,
    date: new Date().toISOString().split('T')[0],
    description: `Purchase Order #${purchaseOrder.id} - ${appliedItems.map(item => `Product ${item.product_Id} (${item.quantity})`).join(', ')}`,
    reference: `PURCHASE-${purchaseOrder.id}`,
    transactionType: 'automatic',
    source: 'Purchase Orders',
    status: 'posted',
    entries: entries,
    totalDebit: Math.round(totalAmount * 100) / 100,
    totalCredit: Math.round(totalAmount * 100) / 100,
    createdAt: new Date().toISOString(),
    originalPurchaseOrder: purchaseOrder
  };
};

// Convert Sales Order to Journal Entry
export const convertSalesOrderToJournalEntry = (order, accountsList) => {
  if (!order) return null;

  const entries = [];
  
  const subTotal = parseFloat(order.subTotal) || 0;
  const taxAmount = parseFloat(order.taxAmount) || 0;
  const total = parseFloat(order.total) || 0;
  
  if (!order.paid || !order.fulfilled || order.status !== 'Closed') {
    return null;
  }
  
  const cashAccount = findAccountByType(accountsList, 'assets');
  entries.push({
    accountId: cashAccount.id,
    accountName: cashAccount.name,
    accountCode: cashAccount.code,
    debit: total,
    credit: 0,
    description: `Cash received from Order #${order.orderId} - ${order.lineItems.map(item => item.productName).join(', ')}`
  });

  if (subTotal > 0) {
    const revenueAccount = findAccountByType(accountsList, 'revenue');
    entries.push({
      accountId: revenueAccount.id,
      accountName: revenueAccount.name,
      accountCode: revenueAccount.code,
      debit: 0,
      credit: subTotal,
      description: `Revenue from Order #${order.orderId}`
    });
  }

  if (taxAmount > 0) {
    const taxAccount = findAccountByType(accountsList, 'liabilities');
    entries.push({
      accountId: taxAccount.id,
      accountName: taxAccount.name,
      accountCode: taxAccount.code,
      debit: 0,
      credit: taxAmount,
      description: `${order.taxRate}% tax collected on Order #${order.orderId}`
    });
  }

  let totalCOGS = 0;
  order.lineItems.forEach(item => {
    if (item.fulfilled && item.status === 'Fulfilled') {
      const costPrice = parseFloat(item.costPrice) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      const itemCOGS = costPrice * quantity;
      totalCOGS += itemCOGS;
    }
  });

  if (totalCOGS > 0) {
    const cogsAccount = findAccountByType(accountsList, 'expenses');
    entries.push({
      accountId: cogsAccount.id,
      accountName: cogsAccount.name,
      accountCode: cogsAccount.code,
      debit: totalCOGS,
      credit: 0,
      description: `COGS for Order #${order.orderId}`
    });

    const inventoryAccount = findAccountByType(accountsList, 'assets', '16');
    entries.push({
      accountId: inventoryAccount.id,
      accountName: inventoryAccount.name,
      accountCode: inventoryAccount.code,
      debit: 0,
      credit: totalCOGS,
      description: `Inventory reduction - Order #${order.orderId}`
    });
  }

  const totalDebit = entries.reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);
  const totalCredit = entries.reduce((sum, entry) => sum + parseFloat(entry.credit || 0), 0);

  return {
    id: `ORDERID-${order.orderId}`,
    date: formatDateFromCreatedAt(order.createdAt),
    description: `Sales Order #${order.orderId} - ${order.lineItems.map(item => `${item.productName} (${item.quantity})`).join(', ')}`,
    reference: `ORDER-${order.orderId}`,
    transactionType: 'automatic',
    source: 'POS Sales',
    status: 'posted',
    entries: entries,
    totalDebit: Math.round(totalDebit * 100) / 100,
    totalCredit: Math.round(totalCredit * 100) / 100,
    createdAt: order.createdAt,
    originalOrder: order
  };
};