import React from "react";
import { XCircle, Download } from "lucide-react";
 
const ViewBillModal = ({ bill, onClose }) => {
  if (!bill) return null;
 
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Bill Details - {bill.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={20} />
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <div className="text-md font-bold text-gray-900">{bill.vendorName}</div>
            <div className="text-sm text-gray-500">{bill.vendorId}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-xs text-gray-500">Bill Date</div>
              <div className="text-sm text-gray-900">{bill.date}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Due Date</div>
              <div className="text-sm text-gray-900">{bill.dueDate}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Amount</div>
              <div className="text-sm text-gray-900">${bill.amount.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Balance</div>
              <div className="text-sm text-gray-900">${bill.balance.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Status</div>
              <div className="text-sm text-gray-900 capitalize">{bill.status}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Source</div>
              <div className="text-sm text-gray-900 capitalize">{bill.source}</div>
            </div>
            {bill.poNumber && (
              <div>
                <div className="text-xs text-gray-500">PO Number</div>
                <div className="text-sm text-gray-900">{bill.poNumber}</div>
              </div>
            )}
          </div>
          <div className="mb-6">
            <div className="text-xs text-gray-500 mb-1">Items</div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Qty</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Unit Price</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bill.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {bill.notes && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Notes</div>
              <div className="text-sm text-gray-900">{bill.notes}</div>
            </div>
          )}
          <div className="flex space-x-3 mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Download size={16} />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
            >
              <XCircle size={16} />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ViewBillModal;
 
