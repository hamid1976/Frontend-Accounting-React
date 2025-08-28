import React from 'react';
import { X } from 'lucide-react';

const JournalEntryDetailModal = ({ entry, onClose, getAccountName }) => {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Journal Entry Details - {entry.id}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4">
          {/* Entry Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Date</label>
              <p className="text-sm text-gray-900">{entry.date}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Reference</label>
              <p className="text-sm text-gray-900">{entry.reference}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-sm text-gray-900">{entry.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Source</label>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                entry.source === 'POS Sales' ? 'bg-green-100 text-green-800' : 
                entry.source === 'Purchase Orders' ? 'bg-blue-100 text-blue-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {entry.source}
              </span>
            </div>
          </div>
          
          {/* Entry Lines */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Account Entries</h4>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Account</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Debit</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entry.entries.map((entryLine, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {getAccountName(entryLine.accountId)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {entryLine.description}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {entryLine.debit > 0 ? `${entryLine.debit.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {entryLine.credit > 0 ? `${entryLine.credit.toFixed(2)}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="2" className="px-4 py-2 text-sm font-medium text-gray-900">
                      Totals:
                    </td>
                    <td className="px-4 py-2 text-sm font-bold text-gray-900 text-right">
                      PKR {entry.totalDebit.toLocaleString('en-PK', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className="px-4 py-2 text-sm font-bold text-gray-900 text-right">
                      PKR {entry.totalCredit.toLocaleString('en-PK', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Original Purchase Order Info (if available) */}
          {entry.originalPurchaseOrder && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Original Purchase Order Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">PO ID:</span>
                  <p className="text-gray-900">{entry.originalPurchaseOrder.id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Status:</span>
                  <p className="text-gray-900">{entry.originalPurchaseOrder.status}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Vendor ID:</span>
                  <p className="text-gray-900">{entry.originalPurchaseOrder.vendor_Id || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Type:</span>
                  <p className="text-gray-900">{entry.originalPurchaseOrder.type || 'Standard'}</p>
                </div>
              </div>
              
              {/* Purchase Items */}
              <div className="mt-4">
                <span className="font-medium text-gray-500">Purchase Items (Applied Only):</span>
                <div className="mt-2 space-y-2">
                  {entry.originalPurchaseOrder.purchaseOrderItems
                    .filter(item => item.status === 'applied' && item.quantity > 0)
                    .map((item, index) => (
                    <div key={index} className="text-sm bg-white p-2 rounded border">
                      <span className="font-medium">Product ID: {item.product_Id}</span> - 
                      Qty: {item.quantity}, Price per Unit: PKR {parseFloat(item.pricePerUnit).toLocaleString('en-PK', {minimumFractionDigits: 2, maximumFractionDigits: 2})}, 
                      Total: PKR {(parseFloat(item.pricePerUnit) * parseFloat(item.quantity)).toLocaleString('en-PK', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      {item.remarks && item.remarks !== 'null' && <span className="text-gray-500"> ({item.remarks})</span>}
                    </div>
                  ))}
                </div>
                
                {entry.originalPurchaseOrder.remarks && entry.originalPurchaseOrder.remarks !== 'null' && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-500">Remarks:</span>
                    <p className="text-gray-900 text-sm">{entry.originalPurchaseOrder.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Original Order Info (if available) */}
          {entry.originalOrder && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Original Sales Order Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Order ID:</span>
                  <p className="text-gray-900">{entry.originalOrder.orderId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Status:</span>
                  <p className="text-gray-900">{entry.originalOrder.status}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Payment Status:</span>
                  <p className="text-gray-900">{entry.originalOrder.paid ? 'Paid' : 'Unpaid'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Fulfilled:</span>
                  <p className="text-gray-900">{entry.originalOrder.fulfilled ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              {/* Line Items */}
              <div className="mt-4">
                <span className="font-medium text-gray-500">Line Items:</span>
                <div className="mt-2 space-y-2">
                  {entry.originalOrder.lineItems.map((item, index) => (
                    <div key={index} className="text-sm bg-white p-2 rounded border">
                      <span className="font-medium">{item.productName}</span> - 
                      Qty: {item.quantity}, Price: PKR {parseFloat(item.price).toLocaleString('en-PK', {minimumFractionDigits: 2, maximumFractionDigits: 2})}, 
                      Total: PKR {parseFloat(item.total).toLocaleString('en-PK', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      {item.taxAmount > 0 && <span className="text-gray-500"> (Tax: PKR {parseFloat(item.taxAmount).toLocaleString('en-PK', {minimumFractionDigits: 2, maximumFractionDigits: 2})})</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Entry Metadata */}
          <div className="text-xs text-gray-500">
            <p>Created: {new Date(entry.createdAt).toLocaleString()}</p>
            <p>Status: {entry.status}</p>
            <p>Type: {entry.transactionType}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryDetailModal;