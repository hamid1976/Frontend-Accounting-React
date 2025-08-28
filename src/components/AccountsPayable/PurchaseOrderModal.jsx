// src/components/AccountsPayable/PurchaseOrderModal.jsx
import React from 'react';
import { XCircle, CheckCircle, Edit, Download } from 'lucide-react';
import { 
  getVendorName, 
  getProductDetails, 
  getPOStatusColor, 
  getPOOverallStatus,
  formatCurrency 
} from '../../utils/apCalculations';

// const PurchaseOrderModal = ({ purchaseOrder, onClose, vendors, products }) => {
//   if (!purchaseOrder) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Purchase Order Details - #{purchaseOrder.id}
//             </h3>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <XCircle size={20} />
//             </button>
//           </div>
//         </div>
        
//         {/* Body */}
//         <div className="px-6 py-4">
          
//           {/* PO Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Purchase Order ID</label>
//                 <p className="text-sm text-gray-900">{purchaseOrder.id}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">PO ID</label>
//                 <p className="text-sm text-gray-900">PO-{purchaseOrder.POID}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Vendor</label>
//                 <p className="text-sm text-gray-900">
//                   {getVendorName(purchaseOrder.vendor_Id || purchaseOrder.Vendor_Id)}
//                 </p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Status</label>
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPOStatusColor(getPOOverallStatus(purchaseOrder))}`}>
//                   {getPOOverallStatus(purchaseOrder)}
//                 </span>
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Type</label>
//                 <p className="text-sm text-gray-900">{purchaseOrder.type || 'Standard PO'}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Total Amount</label>
//                 <p className="text-lg font-bold text-gray-900">
//                   {formatCurrency(
//                     purchaseOrder.purchaseOrderItems.reduce(
//                       (sum, item) => sum + (item.totalPrice || 0), 
//                       0
//                     )
//                   )}
//                 </p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Remarks</label>
//                 <p className="text-sm text-gray-900">{purchaseOrder.remarks || 'No remarks'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Purchase Order Items */}
//           <div className="mb-6">
//             <h4 className="text-md font-semibold text-gray-900 mb-3">Purchase Order Items</h4>
//             <div className="overflow-x-auto">
//               <table className="w-full border border-gray-200 rounded">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
//                     <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
//                     <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Unit Price</th>
//                     <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total Price</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Grn Status</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Remarks</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {purchaseOrder.purchaseOrderItems.map((item, index) => {
//                     const product = getProductDetails(item.product_Id);
//                     return (
//                       <tr key={index}>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           <div>
//                             <div className="font-medium">{product.name}</div>
//                             {product.description && (
//                               <div className="text-xs text-gray-500">{product.description}</div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
//                         <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.pricePerUnit)}</td>
//                         <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.totalPrice)}</td>
//                         <td className="px-4 py-2">
//                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPOStatusColor(item.status)}`}>
//                             {item.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900">{item.remarks || 'No remarks'}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//                 <tfoot className="bg-gray-50">
//                   <tr>
//                     <td colSpan="3" className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
//                       Total:
//                     </td>
//                     <td className="px-4 py-2 text-sm font-bold text-gray-900 text-right">
//                       {formatCurrency(purchaseOrder.purchaseOrderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0))}
//                     </td>
//                     <td colSpan="2"></td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex space-x-3">
//             <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
//               <CheckCircle size={16} />
//               <span>Process Payment</span>
//             </button>
//             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
//               <Edit size={16} />
//               <span>Edit PO</span>
//             </button>
//             <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2">
//               <Download size={16} />
//               <span>Export PDF</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PurchaseOrderModal;

const PurchaseOrderModal = ({ 
  purchaseOrder, 
  onClose, 
  vendors, 
  products,
  onRefresh 
}) => {
  const [localPurchaseOrder, setLocalPurchaseOrder] = useState(purchaseOrder);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  // Load payment history when purchase order changes
  useEffect(() => {
    if (purchaseOrder) {
      setLocalPurchaseOrder(purchaseOrder);
      loadPaymentHistory();
    }
  }, [purchaseOrder]);

  const loadPaymentHistory = () => {
    // Implement payment history loading logic similar to Invoice Detail Modal
    const storedPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    let poPayments = storedPayments.filter(
      payment => payment.purchaseOrderId === purchaseOrder.id || payment.POID === purchaseOrder.POID
    );

    // Deduplicate exact duplicates
    const uniquePayments = [];
    const seen = new Set();

    poPayments.forEach(payment => {
      const key = `${payment.date}-${payment.amount}-${payment.paymentMethod}-${payment.memo}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePayments.push(payment);
      }
    });

    // Sort newest first
    uniquePayments.sort((a, b) => new Date(b.date) - new Date(a.date));

    setPaymentHistory(uniquePayments);
  };

  const handlePaymentComplete = (paymentData, isFullPayment) => {
    const totalPOAmount = localPurchaseOrder.purchaseOrderItems.reduce(
      (sum, item) => sum + (item.totalPrice || 0), 
      0
    );

    if (isFullPayment || paymentData.amount >= totalPOAmount) {
      // Full payment case
      const updatedPO = {
        ...localPurchaseOrder,
        paid: true,
        paymentStatus: 'paid',
        remainingAmount: 0,
        paymentDate: new Date().toISOString(),
      };

      // Update in localStorage
      const existingPOs = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
      const poIndex = existingPOs.findIndex(
        (po) => po.id === updatedPO.id || po.POID === updatedPO.POID
      );
      if (poIndex !== -1) {
        existingPOs[poIndex] = updatedPO;
        localStorage.setItem('purchaseOrders', JSON.stringify(existingPOs));
      }

      setLocalPurchaseOrder(updatedPO);
    } else {
      // Partial payment
      const updatedPO = {
        ...localPurchaseOrder,
        paid: false,
        paymentStatus: 'partial',
        remainingAmount: totalPOAmount - paymentData.amount,
      };

      // Update in localStorage
      const existingPOs = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
      const poIndex = existingPOs.findIndex(
        (po) => po.id === updatedPO.id || po.POID === updatedPO.POID
      );
      if (poIndex !== -1) {
        existingPOs[poIndex] = updatedPO;
        localStorage.setItem('purchaseOrders', JSON.stringify(existingPOs));
      }

      setLocalPurchaseOrder(updatedPO);
    }

    loadPaymentHistory();

    if (onRefresh) {
      onRefresh();
    }

    setPaymentModalOpen(false);
  };

  const handleMarkAsPaid = async () => {
    try {
      // Update PO status in localStorage
      const existingPOs = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
      const poIndex = existingPOs.findIndex(po => 
        po.id === localPurchaseOrder.id || po.POID === localPurchaseOrder.POID
      );
      
      if (poIndex !== -1) {
        existingPOs[poIndex] = {
          ...existingPOs[poIndex],
          paid: true,
          paymentStatus: 'paid',
          paymentDate: new Date().toISOString().split('T')[0],
          remainingAmount: 0
        };
        
        localStorage.setItem('purchaseOrders', JSON.stringify(existingPOs));
      }

      // Update local state
      setLocalPurchaseOrder(prev => ({
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

  const getPaymentStatusBadge = (po) => {
    let statusClass = '';
    let statusText = '';
    
    if (po.paid) {
      statusClass = 'bg-green-100 text-green-800';
      statusText = 'Paid';
    } else if (po.paymentStatus === 'partial') {
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

  if (!localPurchaseOrder) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        {/* [Previous Modal Content Remains the Same] */}
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          {!localPurchaseOrder.paid && (
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <DollarSign size={16} />
              Record Payment
            </button>
          )}
          
          {!localPurchaseOrder.paid && (
            <button
              onClick={handleMarkAsPaid}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={16} />
              Mark as Paid
            </button>
          )}
          
          <button 
            onClick={() => {/* Implement Edit PO functionality */}}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit size={16} />
            Edit PO
          </button>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <RecordPaymentModal
          purchaseOrder={localPurchaseOrder}
          onClose={() => setPaymentModalOpen(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </>
  );
};

export default PurchaseOrderModal;