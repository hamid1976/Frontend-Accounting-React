// // src/pages/AccountsPayable.jsx
// import React, { useState, useEffect } from 'react';
// import { CreditCard, Loader, AlertTriangle, RefreshCw, XCircle,Download,DollarSign } from 'lucide-react';

// // Import components individually to avoid undefined imports
// import APHeader from '../components/AccountsPayable/APHeader';
// import APSummaryCards from '../components/AccountsPayable/APSummaryCards';
// import APTabs from '../components/AccountsPayable/APTabs';
// import APOverviewTab from '../components/AccountsPayable/APOverviewTab';
// import APPurchaseOrdersTab from '../components/AccountsPayable/APPurchaseOrdersTab';
// import APPaymentsTab from '../components/AccountsPayable/APPaymentsTab';
// import APProductsTab from '../components/AccountsPayable/APProductsTab';
// import RecordPaymentModal from "../components/AccountsReceivable/RecordPaymentModal";

// // Import hooks and utilities
// import { useAPData } from '../components/AccountsPayable/AccountPayableHook/useAPData';
// import { useAPFilters } from '../components/AccountsPayable/AccountPayableHook/useAPFilters';
// import { calculateAPSummary, formatCurrency, getProductDetails } from '../components/AccountsPayable/AccountPayableUtil/apCalculations';

// const AccountsPayable = () => {
//   // State management
//   const [paymentModalOpen, setPaymentModalOpen] = useState(false);
// const [selectedInvoice, setSelectedInvoice] = useState(null);

//   const [activeTab, setActiveTab] = useState('overview');
//   const [selectedVendor, setSelectedVendor] = useState(null);
//   const [selectedPO, setSelectedPO] = useState(null);

//   // Custom hooks for data management
//   const {
//     purchaseOrders,
//     vendors,
//     products,
//     loading,
//     error,
//     refreshAllData
//   } = useAPData();

//   const {
//     filters,
//     setFilters,
//     getFilteredVendors,
//     getFilteredPurchaseOrders,
//     resetFilters,
//     getFilterCounts
//   } = useAPFilters(vendors.data, purchaseOrders.data);

//   // Calculations
//   const summary = calculateAPSummary(vendors, purchaseOrders);
//   const filteredVendors = getFilteredVendors();
//   const filteredPurchaseOrders = getFilteredPurchaseOrders();
//   const filterCounts = getFilterCounts();

//   // Loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="flex items-center space-x-3">
//           <Loader className="animate-spin text-rose-600" size={24} />
//           <span className="text-gray-600">Loading data from API...</span>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="max-w-7xl mx-auto p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//           <div className="flex items-center mb-4">
//             <AlertTriangle className="text-red-600 mr-2" size={20} />
//             <h3 className="font-medium text-red-800">API Connection Error</h3>
//           </div>
//           <div className="text-red-700 mb-4">
//             {error}
//           </div>
//           <button
//             onClick={refreshAllData}
//             className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
//           >
//             <RefreshCw size={16} />
//             <span>Retry Connection</span>
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white">
//       <APHeader />
      
//       <APSummaryCards summary={summary} />
      
//       <APTabs activeTab={activeTab} setActiveTab={setActiveTab} />

//       {/* Tab Content */}
//       {activeTab === 'overview' && (
//         <APOverviewTab
//           filters={filters}
//           setFilters={setFilters}
//           filteredVendors={filteredVendors}
//           purchaseOrders={purchaseOrders}
//           onVendorSelect={setSelectedVendor}
//           onPOSelect={setSelectedPO}
//           onRefresh={refreshAllData}
//           filterCounts={filterCounts}
//         />
//       )}

//       {activeTab === 'purchase-orders' && (
//         <APPurchaseOrdersTab
//           purchaseOrders={{ data: filteredPurchaseOrders }}
//           vendors={vendors}
//           products={products}
//           onPOSelect={setSelectedPO}
//           filters={filters}
//           setFilters={setFilters}
//         />
//       )}

//       {activeTab === 'payments' && (
//         <APPaymentsTab
//           purchaseOrders={purchaseOrders}
//           vendors={vendors}
//           products={products}
//         />
//       )}

//       {activeTab === 'products' && (
//         <APProductsTab
//           products={products}
//         />
//       )}

//       {/* Simple Modals - Inline Components */}
//       {selectedVendor && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Vendor Details - {selectedVendor.name}
//                 </h3>
//                 <button
//                   onClick={() => setSelectedVendor(null)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <XCircle size={20} />
//                 </button>
//               </div>
//             </div>
            
//             <div className="px-6 py-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Vendor ID</label>
//                   <p className="text-sm text-gray-900">{selectedVendor.id}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Type</label>
//                   <p className="text-sm text-gray-900">{selectedVendor.vendorType}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Email</label>
//                   <p className="text-sm text-gray-900">{selectedVendor.email}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Phone</label>
//                   <p className="text-sm text-gray-900">{selectedVendor.phone}</p>
//                 </div>
//               </div>
              
//               <div className="mt-4">
//                 <label className="text-sm font-medium text-gray-500">Purchase Orders</label>
//                 <div className="mt-2">
//                   {selectedVendor.purchaseOrders?.length > 0 ? (
//                     <div className="space-y-2">
//                       {selectedVendor.purchaseOrders.map((po, index) => (
//                         <div key={index} className="p-2 bg-gray-50 rounded text-sm">
//                           PO-{po.POID}: {formatCurrency(po.purchaseOrderItems.reduce((sum, item) => 
//                             sum + ((item.quantity || 0) * (item.pricePerUnit || 0)), 0))}
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-500">No purchase orders</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {selectedPO && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Purchase Order Details - PO-{selectedPO.POID}
//                 </h3>
//                 <button
//                   onClick={() => setSelectedPO(null)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <XCircle size={20} />
//                 </button>
//               </div>
//             </div>
            
//             <div className="px-6 py-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">PO ID</label>
//                   <p className="text-sm text-gray-900">PO-{selectedPO.POID}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Vendor</label>
//                   <p className="text-sm text-gray-900">{selectedPO.vendorName}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Status</label>
//                   <p className="text-sm text-gray-900">{selectedPO.status}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Remarks</label>
//                   <p className="text-sm text-gray-900">{selectedPO.remarks || 'No remarks'}</p>
//                 </div>
//               </div>
              
//               {/* Items Table */}
// <div>
//   <h4 className="text-md font-semibold text-gray-900 mb-3">Items</h4>
//   <div className="overflow-x-auto">
//     <table className="w-full border border-gray-200 rounded">
//       <thead className="bg-gray-50">
//         <tr>
//           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
//           <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
//           <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Unit Price</th>
//           <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
//           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Grn Status</th>
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-gray-200">
//         {selectedPO.purchaseOrderItems?.map((item, index) => {
//           const product = getProductDetails(item.product_Id);
//           const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
//           return (
//             <tr key={index}>
//               <td className="px-4 py-2 text-sm text-gray-900">
//                 {product.name}
//                 {product.description && (
//                   <div
//                     className="text-xs text-gray-500"
//                     dangerouslySetInnerHTML={{ __html: product.description }}
//                   />
//                 )}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
//               <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.pricePerUnit)}</td>
//               <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatCurrency(itemTotal)}</td>
//               <td className="px-4 py-2">
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                   item.status === 'applied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {item.status}
//                 </span>
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   </div>
// {/* Action Buttons */}
// <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
//   {!selectedPO?.paid && (
//     <button
//       onClick={() => {
//         setSelectedInvoice(selectedPO); // For vendor payment
//         setPaymentModalOpen(true);
//       }}
//       className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//     >
//       <DollarSign size={16} />
//       Record Payment
//     </button>
//   )}

//   <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
//     <Download size={16} />
//     Download Invoice
//   </button>
// </div>

// {/* Vendor Filter Section */}
// <div className="mt-6">
//   <h2 className="text-lg font-semibold mb-2">Filter by Vendor</h2>
//   <select
//     className="border border-gray-300 rounded-lg px-3 py-2 w-64"
//     value={selectedVendor || ""}
//     onChange={(e) => setSelectedVendor(e.target.value)}
//   >
//     <option value="">All Vendors</option>
//     {vendors.map((vendor) => (
//       <option key={vendor.id} value={vendor.id}>
//         {vendor.name}
//       </option>
//     ))}
//   </select>
// </div>

// {/* Filtered Purchase Orders */}
// <div className="mt-4">
//   {purchaseOrders
//     .filter((po) =>
//       selectedVendor ? po.vendorId === selectedVendor : true
//     )
//     .map((po) => (
//       <div
//         key={po.id}
//         className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md cursor-pointer"
//         onClick={() => setSelectedPO(po)}
//       >
//         <div className="flex justify-between items-center">
//           <span className="font-medium">PO #{po.id}</span>
//           <span className="text-sm text-gray-500">{po.vendorName}</span>
//         </div>
//         <div className="mt-2 text-sm text-gray-600">
//           Amount: {formatCurrency(po.totalAmount)}
//         </div>
//       </div>
//     ))}
// </div>


//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccountsPayable;

// src/pages/AccountsPayable.jsx
import React, { useState } from 'react';
import { CreditCard, Loader, AlertTriangle, RefreshCw, XCircle, Download, DollarSign } from 'lucide-react';

// Import components individually to avoid undefined imports
import APHeader from '../components/AccountsPayable/APHeader';
import APSummaryCards from '../components/AccountsPayable/APSummaryCards';
import APTabs from '../components/AccountsPayable/APTabs';
import APOverviewTab from '../components/AccountsPayable/APOverviewTab';
import APPurchaseOrdersTab from '../components/AccountsPayable/APPurchaseOrdersTab';
import APPaymentsTab from '../components/AccountsPayable/APPaymentsTab';
import APProductsTab from '../components/AccountsPayable/APProductsTab';
import RecordPaymentModal from "../components/AccountsPayable/RecordPaymentModal";

// Import hooks and utilities
import { useAPData } from '../components/AccountsPayable/AccountPayableHook/useAPData';
import { useAPFilters } from '../components/AccountsPayable/AccountPayableHook/useAPFilters';
import { calculateAPSummary, formatCurrency, getProductDetails } from '../components/AccountsPayable/AccountPayableUtil/apCalculations';

const AccountsPayable = () => {
  // State management
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);
const [payments, setPayments] = useState([]);

  // Custom hooks for data management
  const {
    purchaseOrders,
    vendors,
    products,
    loading,
    error,
    refreshAllData
  } = useAPData();

  const {
    filters,
    setFilters,
    getFilteredVendors,
    getFilteredPurchaseOrders,
    resetFilters,
    getFilterCounts
  } = useAPFilters(vendors.data, purchaseOrders.data);

  // Calculations
  const summary = calculateAPSummary(vendors, purchaseOrders);
  const filteredVendors = getFilteredVendors();
  const filteredPurchaseOrders = getFilteredPurchaseOrders();
  const filterCounts = getFilterCounts();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <Loader className="animate-spin text-rose-600" size={24} />
          <span className="text-gray-600">Loading data from API...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-red-600 mr-2" size={20} />
            <h3 className="font-medium text-red-800">API Connection Error</h3>
          </div>
          <div className="text-red-700 mb-4">{error}</div>
          <button
            onClick={refreshAllData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <APHeader />

      <APSummaryCards summary={summary} />

      <APTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <APOverviewTab
          filters={filters}
          setFilters={setFilters}
          filteredVendors={filteredVendors}
          purchaseOrders={purchaseOrders}
          onVendorSelect={setSelectedVendor}
          onPOSelect={setSelectedPO}
          onRefresh={refreshAllData}
          filterCounts={filterCounts}
        />
      )}

      {activeTab === 'purchase-orders' && (
        <APPurchaseOrdersTab
          purchaseOrders={{ data: filteredPurchaseOrders }}
          vendors={vendors}
          products={products}
          onPOSelect={setSelectedPO}
          filters={filters}
          setFilters={setFilters}
        />
      )}

    {activeTab === 'payments' && (
  <APPaymentsTab
    payments={payments}
    setPayments={setPayments}
    vendors={vendors.data}
  />
)}


      {activeTab === 'products' && <APProductsTab products={products} />}

      {/* Simple Modals - Inline Components */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Vendor Details - {selectedVendor.name}</h3>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Vendor ID</label>
                  <p className="text-sm text-gray-900">{selectedVendor.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-sm text-gray-900">{selectedVendor.vendorType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{selectedVendor.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm text-gray-900">{selectedVendor.phone}</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">Purchase Orders</label>
                <div className="mt-2">
                  {selectedVendor.purchaseOrders?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedVendor.purchaseOrders.map((po, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          PO-{po.POID}:{' '}
                          {formatCurrency(
                            po.purchaseOrderItems.reduce(
                              (sum, item) => sum + (item.quantity || 0) * (item.pricePerUnit || 0),
                              0
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No purchase orders</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPO && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Purchase Order Details - PO-{selectedPO.POID}</h3>
                <button onClick={() => setSelectedPO(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {/* ✅ Added PO Details above items table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">PO ID</label>
                  <p className="text-sm text-gray-900">PO-{selectedPO.POID}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Vendor</label>
                  <p className="text-sm text-gray-900">{selectedPO.vendorName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-sm text-gray-900">{selectedPO.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Remarks</label>
                  <p className="text-sm text-gray-900">{selectedPO.remarks || 'No remarks'}</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Items</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Unit Price</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Grn Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedPO.purchaseOrderItems?.map((item, index) => {
                        const product = getProductDetails(item.product_Id);
                        const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
                        return (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {product.name}
                              {product.description && (
                                <div
                                  className="text-xs text-gray-500"
                                  dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">
                              {formatCurrency(item.pricePerUnit)}
                            </td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                              {formatCurrency(itemTotal)}
                            </td>
                            <td className="px-4 py-2">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  item.status === 'applied'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  {!selectedPO?.paid && (
                    <button
                      onClick={() => {
                        setSelectedInvoice(selectedPO); // For vendor payment
                        setPaymentModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <DollarSign size={16} />
                      Record Payment
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
        </div>
      )}
{/* Payment Modal */}
{paymentModalOpen && selectedInvoice && (
  <RecordPaymentModal
    invoiceId={selectedInvoice.POID}
    amount={selectedInvoice.remainingAmount ?? selectedInvoice.total ?? 0}
    total={selectedInvoice.total ?? 
      // Calculate total from items if available
      (selectedInvoice.purchaseOrderItems?.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.pricePerUnit || 0), 
        0
      )) ?? 
      selectedInvoice.remainingAmount ?? 
      0}
    customerId={selectedInvoice.vendorId}
    onClose={() => setPaymentModalOpen(false)}
    onSubmit={(payment, isFull) => {
      console.log('Payment submitted:', payment, isFull);
    }}
    onPaymentComplete={(payment, isFull) => {
      console.log('Payment completed:', payment, isFull);
      refreshAllData(); // refresh UI after payment
    }}
  />
)}
    </div>
  );
};

export default AccountsPayable;
