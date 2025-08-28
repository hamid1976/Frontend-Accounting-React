import React from 'react';
import { XCircle, Plus, CheckCircle, Mail } from 'lucide-react';
import { formatCurrency, formatDate } from '../components/AccountsReceivable/AccountsReceivableUtils/formatters';
import { getCreditStatusColor } from '../components/AccountsReceivable/AccountsReceivableUtils/styleHelpers';

const CustomerDetailModal = ({ customer, onClose, allSalesData }) => {
  const customerOrders = (allSalesData || [])
    .filter(order => {
      if (customer.id.startsWith('guest-')) {
        return order.orderId === customer.orderId;
      }
      return order.customerId === customer.id;
    });

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Customer Details - {customer.name}
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
          {/* Customer Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer ID</label>
                <p className="text-sm text-gray-900">{customer.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{customer.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">{customer.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-sm text-gray-900">{customer.address}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer Type</label>
                <p className="text-sm text-gray-900">{customer.customerType.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Credit Limit</label>
                <p className="text-sm text-gray-900">{formatCurrency(customer.creditLimit)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                <p className="text-sm text-gray-900">{customer.paymentTerms} days</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Credit Status</label>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCreditStatusColor(customer.creditStatus)}`}>
                  {customer.creditStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-600">Current Balance</div>
              <div className="text-xl font-bold text-blue-900">
                {formatCurrency(customer.totalOwed)}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-red-600">Overdue Amount</div>
              <div className="text-xl font-bold text-red-900">
                {formatCurrency(customer.overdueAmount)}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-green-600">Credit Available</div>
              <div className="text-xl font-bold text-green-900">
                {formatCurrency(customer.creditLimit - customer.totalOwed)}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-purple-600">Avg Payment Days</div>
              <div className="text-xl font-bold text-purple-900">
                {customer.avgPaymentDays}
              </div>
            </div>
          </div>

          {/* Customer Orders */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Customer Orders</h4>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Order Id</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Items</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Payment</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customerOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="px-4 py-2 text-sm text-gray-900">{order.orderId}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {order.lineItems.map(item => item.productName).join(', ')}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(order.total)}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {order.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.fulfilled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.fulfilled ? 'Fulfilled' : 'UnFulfillment'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {customerOrders.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No orders found for this customer
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2">
              <Plus size={16} />
              <span>Download Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;