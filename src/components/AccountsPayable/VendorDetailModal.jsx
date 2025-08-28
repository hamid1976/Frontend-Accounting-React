// src/components/AccountsPayable/VendorDetailModal.jsx
import React from 'react';
import { XCircle, Plus, CheckCircle, Mail } from 'lucide-react';
import { 
  getCreditStatusColor, 
  getPOStatusColor, 
  getProductDetails, 
  formatCurrency 
} from '../../utils/apCalculations';

const VendorDetailModal = ({ vendor, onClose, purchaseOrders, products }) => {
  if (!vendor) return null;

  const vendorPOs = (window.allPurchaseOrdersData || [])
    .filter(po => {
      if (vendor.id.startsWith('unknown-vendor-')) {
        return po.id === vendor.poId;
      }
      return (po.vendor_Id === vendor.id || po.Vendor_Id === vendor.id);
    });

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Vendor Details - {vendor.name}
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
          {/* Vendor Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Vendor ID</label>
                <p className="text-sm text-gray-900">{vendor.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{vendor.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">{vendor.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-sm text-gray-900">{vendor.address}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Vendor Type</label>
                <p className="text-sm text-gray-900">{vendor.vendorType.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Credit Limit</label>
                <p className="text-sm text-gray-900">{formatCurrency(vendor.creditLimit)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                <p className="text-sm text-gray-900">{vendor.paymentTerms} days</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Credit Status</label>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCreditStatusColor(vendor.creditStatus)}`}>
                  {vendor.creditStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-600">Pending Amount</div>
              <div className="text-xl font-bold text-blue-900">
                {formatCurrency(vendor.totalPayable)}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-red-600">Overdue Amount</div>
              <div className="text-xl font-bold text-red-900">
                {formatCurrency(vendor.overdueAmount)}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-green-600">Credit Available</div>
              <div className="text-xl font-bold text-green-900">
                {formatCurrency(vendor.creditLimit - vendor.totalPayable)}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-purple-600">Avg Payment Days</div>
              <div className="text-xl font-bold text-purple-900">
                {vendor.avgPaymentDays}
              </div>
            </div>
          </div>

          {/* Vendor Purchase Orders */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Vendor Purchase Orders</h4>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">PO</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Products</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vendorPOs.map((po) => {
                    const poTotal = po.purchaseOrderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
                    return (
                      <tr key={po.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">#{po.id}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {po.purchaseOrderItems.map((item, index) => {
                            const product = getProductDetails(item.product_Id);
                            return (
                              <span key={index} className="block">
                                {product.name} x{item.quantity}
                              </span>
                            );
                          })}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(poTotal)}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPOStatusColor(po.status)}`}>
                            {po.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{po.remarks || 'No remarks'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {vendorPOs.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No purchase orders found for this vendor
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center space-x-2">
              <Plus size={16} />
              <span>New Purchase Order</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>Record Payment</span>
            </button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center space-x-2">
              <Mail size={16} />
              <span>Send Statement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailModal;