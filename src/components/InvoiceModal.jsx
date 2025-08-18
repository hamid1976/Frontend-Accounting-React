// import React from 'react';
// import { XCircle } from 'lucide-react';
 
// const InvoiceModal = ({ invoice, onClose }) => {
//   if (!invoice) return null;
 
//   return (
//     <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-xl w-full overflow-y-auto max-h-[90vh] shadow-lg">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">Invoice Details - {invoice.id}</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <XCircle size={20} />
//           </button>
//         </div>
//         <div className="px-6 py-4 space-y-6">
//           <div>
//             <div className="flex justify-between mb-2">
//               <div>
//                 <div className="text-xs text-gray-500">Customer</div>
//                 <div className="font-medium">{invoice.customerName}</div>
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500">Date</div>
//                 <div>{invoice.date}</div>
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500">Due Date</div>
//                 <div>{invoice.dueDate}</div>
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <div>
//                 <span className="text-xs text-gray-500">Status: </span>
//                 <span className="font-medium">{invoice.status}</span>
//               </div>
//               <div>
//                 <span className="text-xs text-gray-500">Source: </span>
//                 <span>{invoice.source}</span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <h4 className="font-semibold text-gray-700 mb-2">Line Items</h4>
//             <table className="w-full border border-gray-200 rounded mb-2">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-2 py-1 text-xs text-gray-500 text-left">Description</th>
//                   <th className="px-2 py-1 text-xs text-gray-500 text-right">Qty</th>
//                   <th className="px-2 py-1 text-xs text-gray-500 text-right">Price</th>
//                   <th className="px-2 py-1 text-xs text-gray-500 text-right">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {invoice.items.map((item, idx) => (
//                   <tr key={idx}>
//                     <td className="px-2 py-1 text-sm">{item.description}</td>
//                     <td className="px-2 py-1 text-sm text-right">{item.quantity}</td>
//                     <td className="px-2 py-1 text-sm text-right">${item.price.toFixed(2)}</td>
//                     <td className="px-2 py-1 text-sm text-right">${item.total.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="flex justify-end font-semibold">
//               Total: ${invoice.amount.toFixed(2)}
//             </div>
//           </div>
//           {invoice.notes && (
//             <div>
//               <h4 className="text-xs text-gray-500">Notes</h4>
//               <div className="text-sm text-gray-800">{invoice.notes}</div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default InvoiceModal;


import React from 'react';
import { 
  XCircle, 
  Download, 
  Mail, 
  CreditCard, 
  Calendar,
  User,
  FileText,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

const InvoiceModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'outstanding': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    alert('Email functionality would be implemented here');
  };

  const handleRecordPayment = () => {
    alert('Payment recording functionality would be implemented here');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in fade-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FileText className="text-emerald-600" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Invoice Details</h3>
                <p className="text-sm text-gray-600">{invoice.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Action Buttons */}
              <button
                onClick={handlePrint}
                className="hidden sm:flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download size={14} />
                <span>Print</span>
              </button>
              <button
                onClick={handleEmail}
                className="hidden sm:flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Mail size={14} />
                <span>Email</span>
              </button>
              {invoice.balance > 0 && (
                <button
                  onClick={handleRecordPayment}
                  className="hidden sm:flex items-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  <CreditCard size={14} />
                  <span>Pay</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Status & Key Info */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(invoice.status)}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    invoice.status === 'paid' ? 'bg-green-500' :
                    invoice.status === 'overdue' ? 'bg-red-500' :
                    invoice.status === 'partial' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
                {invoice.daysOverdue > 0 && (
                  <div className="mt-2 flex items-center text-red-600 text-sm">
                    <AlertTriangle size={14} className="mr-1" />
                    {invoice.daysOverdue} days overdue
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">${invoice.amount?.toFixed(2) || '0.00'}</div>
                    <div className="text-xs text-gray-500">Total Amount</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">${invoice.paid?.toFixed(2) || '0.00'}</div>
                    <div className="text-xs text-gray-500">Amount Paid</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${invoice.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${invoice.balance?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-xs text-gray-500">Balance Due</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice & Customer Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Invoice Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText size={16} className="mr-2 text-emerald-600" />
                  Invoice Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Invoice Number:</span>
                    <span className="text-sm font-medium text-gray-900">{invoice.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      Issue Date:
                    </span>
                    <span className="text-sm text-gray-900">{invoice.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      Due Date:
                    </span>
                    <span className="text-sm text-gray-900">{invoice.dueDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Payment Terms:</span>
                    <span className="text-sm text-gray-900">{invoice.paymentTerms || 'N/A'} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Source:</span>
                    <span className="text-sm font-medium text-blue-600 capitalize">{invoice.source}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <User size={16} className="mr-2 text-emerald-600" />
                  Customer Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Customer Name:</span>
                    <p className="font-medium text-gray-900">{invoice.customerName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Customer ID:</span>
                    <p className="text-sm text-gray-700">{invoice.customerId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign size={16} className="mr-2 text-emerald-600" />
                Line Items
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">${item.price?.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">${item.total?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Section */}
              <div className="mt-4 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Subtotal:</span>
                    <span className="text-sm text-gray-900">${invoice.amount?.toFixed(2)}</span>
                  </div>
                  {invoice.paid > 0 && (
                    <div className="flex justify-between py-1">
                      <span className="text-sm font-medium text-gray-600">Amount Paid:</span>
                      <span className="text-sm text-green-600">-${invoice.paid?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t border-gray-300">
                    <span className="text-lg font-bold text-gray-900">Balance Due:</span>
                    <span className={`text-lg font-bold ${invoice.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${invoice.balance?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-semibold text-blue-900 mb-2">Notes</h4>
                <p className="text-sm text-blue-800">{invoice.notes}</p>
              </div>
            )}

            {/* Payment History */}
            {invoice.paymentHistory && invoice.paymentHistory.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h4 className="font-semibold text-green-900 mb-4">Payment History</h4>
                <div className="space-y-2">
                  {invoice.paymentHistory.map((payment, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard size={14} className="text-green-600" />
                        <span className="text-sm text-gray-900">{payment.date}</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full capitalize">
                          {payment.method?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">${payment.amount?.toFixed(2)}</div>
                        {payment.reference && (
                          <div className="text-xs text-gray-500">{payment.reference}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Action Buttons */}
            <div className="sm:hidden flex flex-col space-y-2">
              <button
                onClick={handleRecordPayment}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <CreditCard size={16} />
                <span>Record Payment</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={14} />
                  <span>Print</span>
                </button>
                <button
                  onClick={handleEmail}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Mail size={14} />
                  <span>Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;