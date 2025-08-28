import React, { useState, useEffect } from 'react';
import { XCircle, CheckCircle, FileText, Download, Clock, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '../components/AccountsReceivable/AccountsReceivableUtils/formatters';
import RecordPaymentModal from '../components/AccountsReceivable/RecordPaymentModal';

const InvoiceDetailModal = ({ invoice, onClose, getCustomerName, onRefresh }) => {
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [localInvoice, setLocalInvoice] = useState(invoice);
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Load payment history when invoice changes
  useEffect(() => {
    if (invoice) {
      setLocalInvoice(invoice);
      loadPaymentHistory();
    }
  }, [invoice]);

  const loadPaymentHistory = () => {
  const storedPayments = JSON.parse(localStorage.getItem('payments') || '[]');
  let invoicePayments = storedPayments.filter(
    payment => payment.invoiceId === invoice.orderId || payment.orderId === invoice.orderId
  );

  // ✅ Deduplicate exact duplicates
  const uniquePayments = [];
  const seen = new Set();

  invoicePayments.forEach(payment => {
    const key = `${payment.date}-${payment.amount}-${payment.paymentMethod}-${payment.memo}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniquePayments.push(payment);
    }
  });

  // ✅ Sort newest first
  uniquePayments.sort((a, b) => new Date(b.date) - new Date(a.date));

  setPaymentHistory(uniquePayments);
};


  //GOOD

    const handlePaymentComplete = (paymentData, isFullPayment) => {
  if (isFullPayment || paymentData.amount >= localInvoice.remainingAmount) {
    // Full payment case
    const updatedInvoice = {
      ...localInvoice,
      paid: true,
      paymentStatus: 'paid',
      remainingAmount: 0,
      paymentDate: new Date().toISOString(),
    };

    // Update in localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = existingOrders.findIndex(
      (order) => order.orderId === updatedInvoice.orderId || order.id === updatedInvoice.orderId
    );
    if (orderIndex !== -1) {
      existingOrders[orderIndex] = updatedInvoice;
      localStorage.setItem('orders', JSON.stringify(existingOrders));
    }

    setLocalInvoice(updatedInvoice);
  } else {
    // Partial payment
    const updatedInvoice = {
      ...localInvoice,
      paid: false,
      paymentStatus: 'partial',
      remainingAmount: paymentData.remainingAmount,
    };

    // Update in localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = existingOrders.findIndex(
      (order) => order.orderId === updatedInvoice.orderId || order.id === updatedInvoice.orderId
    );
    if (orderIndex !== -1) {
      existingOrders[orderIndex] = updatedInvoice;
      localStorage.setItem('orders', JSON.stringify(existingOrders));
    }

    setLocalInvoice(updatedInvoice);
  }

  loadPaymentHistory();

  if (onRefresh) {
    onRefresh();
  }

  setPaymentModalOpen(false);
};

  const handleMarkAsPaid = async () => {
    try {
      // Update order status in localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const orderIndex = existingOrders.findIndex(order => 
        order.orderId === localInvoice.orderId || order.id === localInvoice.orderId
      );
      
      if (orderIndex !== -1) {
        existingOrders[orderIndex] = {
          ...existingOrders[orderIndex],
          paid: true,
          paymentStatus: 'paid',
          paymentDate: new Date().toISOString().split('T')[0],
          remainingAmount: 0
        };
        
        localStorage.setItem('orders', JSON.stringify(existingOrders));
      }

      // Update local state
      setLocalInvoice(prev => ({
        ...prev,
        paid: true,
        paymentStatus: 'paid'
      }));

      // Trigger refresh
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };
  const handleMarkAsFulfilled = async () => {
    try {
      // Update order status in localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const orderIndex = existingOrders.findIndex(order => 
        order.orderId === localInvoice.orderId || order.id === localInvoice.orderId
      );
      
      if (orderIndex !== -1) {
        existingOrders[orderIndex] = {
          ...existingOrders[orderIndex],
          fulfilled: true,
          fulfillmentDate: new Date().toISOString()
        };
        
        localStorage.setItem('orders', JSON.stringify(existingOrders));
      }

      // Update local state
      setLocalInvoice(prev => ({
        ...prev,
        fulfilled: true
      }));

      // Trigger refresh
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error marking as fulfilled:', error);
    }
  };

  const getStatusBadge = (invoice) => {
    let statusClass = '';
    let statusText = '';
    
    if (invoice.paid) {
      statusClass = 'bg-green-100 text-green-800';
      statusText = 'Paid';
    } else if (invoice.paymentStatus === 'partial') {
      statusClass = 'bg-orange-100 text-orange-800';
      statusText = 'Partial Payment';
    } else {
      statusClass = 'bg-red-100 text-red-800';
      statusText = 'Unpaid';
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
        {statusText}
      </span>
    );
  };

  const getFulfillmentBadge = (invoice) => {
    if (invoice.fulfilled) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          Fulfilled
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Pending Fulfillment
        </span>
      );
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Details - #{localInvoice.orderId}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Order ID</label>
                  <p className="text-sm text-gray-900">{localInvoice.orderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer</label>
                  <p className="text-sm text-gray-900">{getCustomerName(localInvoice.customerId)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created Date</label>
                  <p className="text-sm text-gray-900">{formatDate(localInvoice.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-sm text-gray-900">{localInvoice.status}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(localInvoice)}
                    {localInvoice.paymentStatus === 'partial' && (
                      <span className="text-xs text-gray-500">
                        ({formatCurrency(localInvoice.remainingAmount || 0)} remaining)
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fulfillment Status</label>
                  <div className="mt-1">
                    {getFulfillmentBadge(localInvoice)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Amount</label>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(localInvoice.total)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900">{formatDate(localInvoice.updatedAt || localInvoice.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                 <table className="w-full border border-gray-200 rounded">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                       <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
                       <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Unit Price</th>
                       <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200">
                     {invoice.lineItems.map((item, index) => (
                       <tr key={index}>
                         <td className="px-4 py-2 text-sm text-gray-900">{item.productName}</td>
                         <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                         <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.price)}</td>
                         <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.total)}</td>
                         <td className="px-4 py-2">
                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                             item.fulfilled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                           }`}>
                            {item.status}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
            </div>

            {/* Payment History */}
            {paymentHistory.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Payment History</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Memo</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentHistory.map((payment, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatDate(payment.date)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(payment.amount)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{payment.paymentMethod}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{payment.memo || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              {!localInvoice.paid && (
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <DollarSign size={16} />
                  Record Payment
                </button>
              )}
              
              {!localInvoice.paid && (
                <button
                  onClick={handleMarkAsPaid}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={16} />
                  Mark as Paid
                </button>
              )}
              
              {!localInvoice.fulfilled && (
                <button
                  onClick={handleMarkAsFulfilled}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <CheckCircle size={16} />
                  Mark as Fulfilled
                </button>
              )}
              
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={16} />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

     // In InvoiceDetailModal.js, update the payment modal call:

{isPaymentModalOpen && (
  <RecordPaymentModal
    invoiceId={localInvoice.orderId}
    amount={localInvoice.remainingAmount !== undefined 
      ? localInvoice.remainingAmount 
      : localInvoice.total
    }
    onClose={() => setPaymentModalOpen(false)}
    onPaymentComplete={handlePaymentComplete}
    customerId={localInvoice.customerId}
  />
)}
    </>
  );
};

export default InvoiceDetailModal;

