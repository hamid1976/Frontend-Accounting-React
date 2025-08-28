import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { fetchSales, fetchCustomers } from '../components/AccountsReceivable/AccountsReceivableHook/useAPData';
import { getFilteredCustomers } from '../components/AccountsReceivable/AccountsReceivableUtils/apCalculations';
import { parseLocalDate, parseDotTimestampToDate } from '../components/AccountsReceivable/AccountsReceivableUtils/formatters';

import APHeader from '../components/AccountsReceivable/APHeader';
import APSummaryCards from '../components/AccountsReceivable/APSummaryCards';
import APTabs from '../components/AccountsReceivable/APTabs';
import APOverviewTab from '../components/AccountsReceivable/APOverviewTab';
import APAgingTab from '../components/AccountsReceivable/APAgingTab';
import APInvoicesTab from '../components/AccountsReceivable/APInvoicesTab';
import APPaymentsTab from '../components/AccountsReceivable/APPaymentsTab';
import CustomerDetailModal from '../modals/CustomerDetailModal';
import InvoiceDetailModal from '../modals/InvoiceDetailModal';
import APIStatusBadge from '../components/AccountsReceivable/APIStatusBadge';
import LoadingState from '../components/AccountsReceivable/LoadingState';
import ErrorState from '../components/AccountsReceivable/ErrorState';

const AccountsReceivable = () => {
  // State management
  const [sales, setSales] = useState({ loading: false, data: [], error: null });
  const [customers, setCustomers] = useState({ loading: false, data: [], error: null });
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [filters, setFilters] = useState({
    customerType: 'all',
    status: 'all',
    dateRange: '30',
    searchTerm: '',
    fromDate: '',
    toDate: ''
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      const salesData = await fetchSales(setSales);
      if (salesData) {
        window.allSalesData = salesData;
        setTimeout(() => fetchCustomers(setCustomers, salesData), 500);
      }
    };
    loadData();
  }, []);

  // Refresh functionality
  const refreshAllData = async () => {
    const salesData = await fetchSales(setSales);
    if (salesData) {
      window.allSalesData = salesData;
      setTimeout(() => fetchCustomers(setCustomers, salesData), 500);
    }
  };

  // Helper function to get customer name by ID
  const getCustomerName = (customerId) => {
    if (!customerId || customerId === 'null') return 'Guest Customer';
    const customer = customers.data.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  // Loading state
  if (sales.loading || customers.loading) {
    return <LoadingState />;
  }

  // Error state
  if (sales.error || customers.error) {
    return (
      <ErrorState 
        salesError={sales.error} 
        customersError={customers.error}
        onRetry={refreshAllData}
      />
    );
  }

  // Filter customers
  const filteredCustomers = getFilteredCustomers(customers.data, filters);

      const filteredOrders = sales.data.filter(order => {
        // status filter
        if (filters.status === 'paid' && !order.paid) return false;
        if (filters.status === 'unpaid' && order.paid) return false;
        if (filters.status === 'fulfilled' && !order.fulfilled) return false;
        if (filters.status === 'unfulfilled' && order.fulfilled) return false;

        // robust order date parsing
        const orderDate =
          parseDotTimestampToDate(order.createdAt) ||
          (order.createdAt ? new Date(order.createdAt) : null);

        if (!(orderDate instanceof Date) || isNaN(orderDate)) {
          // if we can’t parse the date, exclude the record from date filtering
          // (or return false if you prefer to drop unparseable rows)
          return true;
        }

        // from/to as local inclusive range
        let from = parseLocalDate(filters.fromDate);
        let to = parseLocalDate(filters.toDate);

        // normalize reversed ranges
        if (from && to && to < from) {
          const tmp = from; from = to; to = tmp;
        }

        // include entire "to" day
        if (to) to = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999);

        if (from && orderDate < from) return false;
        if (to && orderDate > to) return false;

        // optional: search term filter (orderId or customer name)
        const term = (filters.searchTerm || '').trim().toLowerCase();
        if (term) {
          const cust = (getCustomerName(order.customerId) || '').toLowerCase();
          const idStr = String(order.orderId || '').toLowerCase();
          if (!cust.includes(term) && !idStr.includes(term)) return false;
        }

        return true;
      });
      const normalizeOrders = (orders) => {
  return orders.map(order => {
    let paymentStatus = 'unpaid';
    if (order.paid === true) {
      paymentStatus = 'paid';
    } else if (order.remainingAmount && order.remainingAmount > 0) {
      paymentStatus = 'partial';
    }
    return {
      ...order,
      paymentStatus,
      remainingAmount: order.remainingAmount || 0,
    };
  });
};


      
// Original filtered customers (for other filters like search, type, etc.)
const filteredCustomersBase = getFilteredCustomers(customers.data, filters);

// Filter customers based on last payment date without changing invoice logic
const filteredCustomersByPaymentDate = filteredCustomersBase.filter((customer) => {
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
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <APHeader />
      <APSummaryCards customers={customers.data} allSalesData={window.allSalesData} />
      <APTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <APOverviewTab
          filters={filters}
          setFilters={setFilters}
          filteredCustomers={filteredCustomers}
          setSelectedCustomer={setSelectedCustomer}
          setShowInvoiceForm={setShowInvoiceForm}
        />
      )}

      {activeTab === 'aging' && (
        <APAgingTab 
          salesData={sales.data} 
          customers={customers.data} 
        />
      )}

      {activeTab === 'invoices' && (
        <APInvoicesTab
          filters={filters}
          setFilters={setFilters}
          filteredOrders={filteredOrders}
          getCustomerName={getCustomerName}
          setViewInvoice={setViewInvoice}
        />
      )}

      {activeTab === 'payments' && (
        <APPaymentsTab
          allSalesData={window.allSalesData}
          getCustomerName={getCustomerName}
        />
      )}

      {/* Modals */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          allSalesData={window.allSalesData}
        />
      )}

      {viewInvoice && (
        <InvoiceDetailModal
          invoice={viewInvoice}
          onClose={() => setViewInvoice(null)}
          getCustomerName={getCustomerName}
          onRefresh={refreshAllData}   // ✅ refresh sales from API after payment

        />
      )}

      <APIStatusBadge 
        salesCount={sales.data.length} 
        customersCount={customers.data.length} 
      />
    </div>
  );
};

export default AccountsReceivable;