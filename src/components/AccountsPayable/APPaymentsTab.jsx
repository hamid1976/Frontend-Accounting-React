import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Download, 
  X, 
  Filter,
  DollarSign 
} from 'lucide-react';
import RecordPaymentModal from "./RecordPaymentModal";

// Utility functions to mimic existing utility imports
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(amount);
};

const getVendorName = (vendorId, vendors = []) => {
  const vendor = vendors.find(v => v.id === vendorId || v.id === parseInt(vendorId));
  return vendor ? vendor.name : 'Unknown Vendor';
};

const APPaymentsTab = () => {
  // Mock data - in a real application, this would come from state or props
  const [vendors] = useState([
    { id: 1, name: 'Hamid Shaikh' },
    { id: 2, name: 'Walk-in Vendor' }
  ]);

  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({
    customer: 'All',
    paymentMethod: 'All',
    account: 'All',
    accountType: 'All',
    status: 'All'
  });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Load payments from localStorage on mount
  useEffect(() => {
    const loadPayments = () => {
      try {
        const storedPayments = JSON.parse(localStorage.getItem('payments') || '[]');
        if (Array.isArray(storedPayments) && storedPayments.length > 0) {
          setPayments(storedPayments);
        } else {
          // Initialize with default payments if none found
          setPayments([
            {
              id: 1,
              vendorId: 1,
              amount: 630000.00,
              date: '2025-08-28',
              method: 'Bank Transfer',
              accountName: 'Accounts Receivable',
              accountType: 'assets',
              status: 'paid',
              memo: 'BAD'
            },
            {
              id: 3,
              vendorId: 2,
              amount: 50000.00,
              date: '2025-08-27',
              method: 'Cash',
              accountName: 'Current Assets',
              accountType: 'Not specified',
              status: 'paid',
              memo: 'ok'
            }
          ]);
        }
      } catch (error) {
        console.error("Error loading payments from localStorage:", error);
        // Use default payments on error
        setPayments([
          {
            id: 1,
            vendorId: 1,
            amount: 630000.00,
            date: '2025-08-28',
            method: 'Bank Transfer',
            accountName: 'Accounts Receivable',
            accountType: 'assets',
            status: 'paid',
            memo: 'BAD'
          }
        ]);
      }
    };

    loadPayments();
    
    // Add event listener to detect localStorage changes from other components
    window.addEventListener('storage', (e) => {
      if (e.key === 'payments') {
        loadPayments();
      }
    });

    // Custom event for direct updates within the same window
    window.addEventListener('paymentsUpdated', loadPayments);

    return () => {
      window.removeEventListener('storage', loadPayments);
      window.removeEventListener('paymentsUpdated', loadPayments);
    };
  }, []);

  const handleRecordPayment = (payment) => {
    setSelectedPayment(payment);
    setSelectedInvoice({
      POID: payment.orderId || payment.id,
      vendorId: payment.vendorId || payment.customerId,
      total: payment.amount,
      remainingAmount: payment.remainingAmount || payment.amount
    });
    setShowPaymentModal(true);
  };

  const handleNewPayment = () => {
    // Create a new empty invoice for payment
    setSelectedInvoice({
      POID: `NEW-${Date.now()}`,
      vendorId: vendors[0].id,
      total: 0,
      remainingAmount: 0
    });
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = (paymentData, isFullPayment) => {
    // Payment has already been saved to localStorage by the modal
    // Just need to refresh our local state
    const updatedPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    setPayments(updatedPayments);
    
    // Close the modal
    setShowPaymentModal(false);
    setSelectedInvoice(null);
    setSelectedPayment(null);
    
    // Trigger event to notify other components
    window.dispatchEvent(new Event('paymentsUpdated'));
  };

  const filteredPayments = payments.filter(payment => {
    return (
      (filters.customer === 'All' || getVendorName(payment.vendorId || payment.customerId, vendors) === filters.customer) &&
      (filters.paymentMethod === 'All' || payment.method === filters.paymentMethod || payment.paymentMethod === filters.paymentMethod) &&
      (filters.account === 'All' || payment.accountName === filters.account) &&
      (filters.accountType === 'All' || payment.accountType === filters.accountType) &&
      (filters.status === 'All' || payment.status.toLowerCase() === filters.status.toLowerCase())
    );
  });

  const totalPayments = filteredPayments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);

  const getPaymentMethodDisplay = (payment) => {
    return payment.method || payment.paymentMethod || 'Not specified';
  };

  const getStatusDisplay = (status) => {
    // Normalize status for display
    status = (status || '').toLowerCase();
    if (status === 'paid' || status === 'completed') return 'Paid';
    if (status === 'partial') return 'Partial';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            {Object.keys(filters).map((filterKey) => (
              <div key={filterKey} className="relative">
                <select
                  value={filters[filterKey]}
                  onChange={(e) => setFilters({...filters, [filterKey]: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="All">{filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}</option>
                  {filterKey === 'customer' && vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                  ))}
                  {filterKey === 'paymentMethod' && ['Cash', 'Bank Transfer', 'Credit Card', 'Check', 'Not specified'].map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                  {filterKey === 'account' && ['Accounts Receivable', 'Current Assets', 'Not specified'].map(account => (
                    <option key={account} value={account}>{account}</option>
                  ))}
                  {filterKey === 'accountType' && ['assets', 'Not specified'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  {filterKey === 'status' && ['Paid', 'Partial', 'Unpaid'].map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {filters[filterKey] !== 'All' && (
                  <button
                    onClick={() => setFilters({...filters, [filterKey]: 'All'})}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Memo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.orderId || payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getVendorName(payment.vendorId || payment.customerId, vendors)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPaymentMethodDisplay(payment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.accountName || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.accountType || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        payment.status === 'paid' || payment.status === 'Paid'
                          ? 'bg-green-100 text-green-800' 
                          : payment.status === 'partial' || payment.status === 'Partial'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {getStatusDisplay(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.memo || ''}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-sm text-gray-500">
                    No payments found. Add a new payment using the "New Payment" button.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Total Payments</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(totalPayments)}
          </span>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <RecordPaymentModal
          invoiceId={selectedInvoice.POID}
          amount={selectedInvoice.remainingAmount || selectedInvoice.total || 0}
          total={selectedInvoice.total || selectedInvoice.remainingAmount || 0}
          customerId={selectedInvoice.vendorId}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
          }}
          onSubmit={handleSubmitPayment}
          onPaymentComplete={handleSubmitPayment}
        />
      )}
    </div>
  );
};

export default APPaymentsTab;