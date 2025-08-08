import React from 'react';
import { XCircle } from 'lucide-react';
 
const InvoiceModal = ({ invoice, onClose }) => {
  if (!invoice) return null;
 
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-xl w-full overflow-y-auto max-h-[90vh] shadow-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Invoice Details - {invoice.id}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={20} />
          </button>
        </div>
        <div className="px-6 py-4 space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <div>
                <div className="text-xs text-gray-500">Customer</div>
                <div className="font-medium">{invoice.customerName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Date</div>
                <div>{invoice.date}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Due Date</div>
                <div>{invoice.dueDate}</div>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <span className="text-xs text-gray-500">Status: </span>
                <span className="font-medium">{invoice.status}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500">Source: </span>
                <span>{invoice.source}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Line Items</h4>
            <table className="w-full border border-gray-200 rounded mb-2">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-1 text-xs text-gray-500 text-left">Description</th>
                  <th className="px-2 py-1 text-xs text-gray-500 text-right">Qty</th>
                  <th className="px-2 py-1 text-xs text-gray-500 text-right">Price</th>
                  <th className="px-2 py-1 text-xs text-gray-500 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-2 py-1 text-sm">{item.description}</td>
                    <td className="px-2 py-1 text-sm text-right">{item.quantity}</td>
                    <td className="px-2 py-1 text-sm text-right">${item.price.toFixed(2)}</td>
                    <td className="px-2 py-1 text-sm text-right">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end font-semibold">
              Total: ${invoice.amount.toFixed(2)}
            </div>
          </div>
          {invoice.notes && (
            <div>
              <h4 className="text-xs text-gray-500">Notes</h4>
              <div className="text-sm text-gray-800">{invoice.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default InvoiceModal;