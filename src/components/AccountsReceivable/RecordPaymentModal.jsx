import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, CreditCard, FileText, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../AccountsReceivable/AccountsReceivableUtils/formatters';

const RecordPaymentModal = ({ invoiceId, amount, onClose, onSubmit, onPaymentComplete, customerId,total }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    method: '',
    account: '',
    memo: ''
  });

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAlreadyPaid, setIsAlreadyPaid] = useState(false);
  const [currentRemainingAmount, setCurrentRemainingAmount] = useState(amount);
  const [originalTotalAmount, setOriginalTotalAmount] = useState(amount);

  // Fetch the current remaining amount from localStorage
  useEffect(() => {
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = existingOrders.find(o => 
      o.orderId === invoiceId || o.id === invoiceId
    );

    if (order) {
      // Calculate remaining based on payment history if remainingAmount is not set
      let remaining = order.remainingAmount;
      
      if (remaining === undefined || remaining === null) {
        // If no remainingAmount field, calculate it from payments
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const orderPayments = payments.filter(p => 
          p.orderId === invoiceId || p.invoiceId === invoiceId
        );
        
        const totalPaid = orderPayments.reduce((sum, payment) => sum + payment.amount, 0);
        remaining = Math.max(0, order.total - totalPaid);
      }
      
      setCurrentRemainingAmount(remaining);
      setOriginalTotalAmount(order.total);
      
      // Set the form amount to the remaining amount by default
      setFormData(prev => ({ ...prev, amount: remaining.toString() }));
      
      // Check if already paid
      if (order.paid || order.paymentStatus === 'paid' || remaining <= 0) {
        setIsAlreadyPaid(true);
      }
    } else {
      // If no order found, use the amount prop
      setCurrentRemainingAmount(amount);
      setOriginalTotalAmount(amount);
      setFormData(prev => ({ ...prev, amount: amount.toString() }));
    }
  }, [invoiceId, amount]);

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/accounts');
      const data = await response.json();

      const assetAccounts = data.filter(acct => acct.type === 'assets');
      const accountMap = {};
      assetAccounts.forEach(acct => accountMap[acct.id] = { ...acct, children: [] });

      assetAccounts.forEach(acct => {
        if (acct.parentId && accountMap[acct.parentId]) {
          accountMap[acct.parentId].children.push(accountMap[acct.id]);
        }
      });

      const tree = assetAccounts.filter(acct => !acct.parentId || !accountMap[acct.parentId]);
      setAccounts(tree);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'Payment date is required';
    }
    
    const paymentAmount = parseFloat(formData.amount);
    if (!formData.amount || paymentAmount <= 0) {
      newErrors.amount = 'Valid payment amount is required';
    } else if (paymentAmount > currentRemainingAmount) {
      newErrors.amount = `Payment cannot exceed remaining amount of ${formatCurrency(currentRemainingAmount)}`;
    }
    
    if (!formData.method) {
      newErrors.method = 'Payment method is required';
    }
    
    if (!formData.account) {
      newErrors.account = 'Deposit account is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isAlreadyPaid) {
      setErrors({
        general: 'This invoice has already been fully paid. No further payments allowed.'
      });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const paymentAmount = parseFloat(formData.amount);
      const newRemainingAmount = Math.max(0, currentRemainingAmount - paymentAmount);
      const isFullPayment = newRemainingAmount <= 0;
      const paymentStatus = isFullPayment ? 'paid' : 'partial';

      // Create payment record
      const paymentData = {
        id: `PAY-${Date.now()}`,
        customerId: customerId || null,
        orderId: invoiceId,
        date: formData.date,
        amount: paymentAmount,
        paymentMethod: formData.method,
        accountId: formData.account,
        accountName: getAccountNameById(formData.account, accounts) || 'Unknown Account',
        accountType: getAccountTypeById(formData.account, accounts) || 'Not specified',

        memo: formData.memo,
        status: paymentStatus,
        remainingAmount: newRemainingAmount,
        createdAt: new Date().toISOString(),
        createdBy: 'current_user'
      };

      // Save payment to localStorage
      const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
      const updatedPayments = [...existingPayments, paymentData];
      localStorage.setItem('payments', JSON.stringify(updatedPayments));

      // Update order in localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const orderIndex = existingOrders.findIndex(order =>
        order.orderId === invoiceId || order.id === invoiceId
      );

      if (orderIndex !== -1) {
        existingOrders[orderIndex] = {
          ...existingOrders[orderIndex],
          paid: isFullPayment,
          paymentStatus: paymentStatus,
          lastPaymentDate: formData.date,
          lastPaymentAmount: paymentAmount,
          remainingAmount: newRemainingAmount,
          paymentHistory: [
            ...(existingOrders[orderIndex].paymentHistory || []),
            paymentData.id
          ]
        };
        localStorage.setItem('orders', JSON.stringify(existingOrders));
      }

      // API Call
      const apiUrl = `https://api-pos.hulmsolutions.com/POS/accountinghamid/bea876f9-b274-4cd2-9f86-d28953bee69d/orders/Paid/${invoiceId}`;
      const payload = {
        customerId: customerId,
        orderId: invoiceId,
        paid: isFullPayment,
        billUnitId: "2",
        billStatus: "pending",
          amount: paymentAmount,         // ✅ actual amount being paid
  total: originalTotalAmount     // ✅ full invoice total
      };

      const apiResponse = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer $hAMID`
        },
        body: JSON.stringify(payload)
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to update order status in API");
      }

      // Callbacks
      if (onSubmit) {
        onSubmit(paymentData, isFullPayment);
      }

      if (onPaymentComplete) {
        onPaymentComplete(paymentData, isFullPayment);
      }

      const message = isFullPayment
        ? "Payment recorded successfully. Invoice is now fully paid."
        : `Partial payment of ${formatCurrency(paymentAmount)} recorded. Remaining balance: ${formatCurrency(newRemainingAmount)}`;

      console.log(message);
      onClose();
    } catch (error) {
      console.error("Error recording payment:", error);
      setErrors({ general: "Failed to record payment. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getAccountNameById = (accountId, accountList) => {
    for (const account of accountList) {
      if (account.id === accountId) {
        return account.name;
      }
      if (account.children && account.children.length > 0) {
        const foundInChildren = getAccountNameById(accountId, account.children);
        if (foundInChildren) return foundInChildren;
      }
    }
    return null;
  };
  const getAccountTypeById = (accountId, accountList) => {
  for (const account of accountList) {
    if (account.id === accountId) {
      return account.type; // ← will return "assets", "liabilities", etc.
    }
    if (account.children && account.children.length > 0) {
      const foundInChildren = getAccountTypeById(accountId, account.children);
      if (foundInChildren) return foundInChildren;
    }
  }
  return null;
};


  const renderAccountOptions = (accountList, level = 0) => {
    return accountList.map(account => (
      <React.Fragment key={account.id}>
        <option value={account.id}>
          {'-'.repeat(level * 2)} {account.code} - {account.name}
        </option>
        {account.children && account.children.length > 0 && (
          renderAccountOptions(account.children, level + 1)
        )}
      </React.Fragment>
    ));
  };

  const paymentAmount = parseFloat(formData.amount) || 0;
  const remainingAmount = Math.max(0, currentRemainingAmount - paymentAmount);
  const isFullPayment = remainingAmount <= 0 && paymentAmount > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Record a payment for this invoice
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 py-4 space-y-5">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-700">{errors.general}</span>
            </div>
          )}

          {/* Show current remaining amount */}
          {currentRemainingAmount > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Current remaining balance: <strong>{formatCurrency(currentRemainingAmount)}</strong>
                {originalTotalAmount > currentRemainingAmount && (
                  <span className="text-xs ml-2">
                    (Original total: {formatCurrency(originalTotalAmount)})
                  </span>
                )}
              </p>
            </div>
          )}
            
          {/* Date Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Calendar size={16} />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <span className="text-xs text-red-600 mt-1">{errors.date}</span>}
          </div>

          {/* Amount Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <DollarSign size={16} />
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                Rs
              </span>
              <input
                type="number"
                step="0.01"
                value={formData.total}
                onChange={(e) => handleChange('amount', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
                max={currentRemainingAmount}
              />
            </div>
            {errors.amount && <span className="text-xs text-red-600 mt-1">{errors.amount}</span>}
            
            {paymentAmount > 0 && (
              <div className="mt-2 text-sm">
                {isFullPayment ? (
                  <span className="text-green-600 font-medium">Invoice will be fully paid</span>
                ) : (
                  <span className="text-orange-600">
                    Partial payment - Remaining: {formatCurrency(remainingAmount)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <CreditCard size={16} />
              Method
            </label>
            <select
              value={formData.method}
              onChange={(e) => handleChange('method', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.method ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a payment method...</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="online">Online Payment</option>
            </select>
            {errors.method && <span className="text-xs text-red-600 mt-1">{errors.method}</span>}
          </div>

          {/* Account */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <FileText size={16} />
              Account
            </label>
            <select
              value={formData.account}
              onChange={(e) => handleChange('account', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.account ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a payment account...</option>
              {renderAccountOptions(accounts)}
            </select>
            {errors.account && <span className="text-xs text-red-600 mt-1">{errors.account}</span>}
            <p className="text-xs text-gray-500 mt-1">
              Any account into which you deposit and withdraw funds from.{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">Learn more</a>
            </p>
          </div>

          {/* Memo */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Memo / notes
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => handleChange('memo', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional notes..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.amount || parseFloat(formData.amount) <= 0 || parseFloat(formData.amount) > currentRemainingAmount}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              loading || !formData.amount || parseFloat(formData.amount) <= 0 || parseFloat(formData.amount) > currentRemainingAmount
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordPaymentModal;




// import React, { useState, useEffect } from 'react';
// import { X, Calendar, DollarSign, CreditCard, FileText, AlertCircle } from 'lucide-react';
// import { formatCurrency } from './AccountsReceivableUtils/formatters';

// const RecordPaymentModal = ({ invoiceId, amount, onClose, onSubmit, onPaymentComplete, customerId, total }) => {
//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split('T')[0],
//     amount: '',
//     method: '',
//     account: '',
//     memo: ''
//   });

//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isAlreadyPaid, setIsAlreadyPaid] = useState(false);
//   const [currentRemainingAmount, setCurrentRemainingAmount] = useState(amount);
//   const [originalTotalAmount, setOriginalTotalAmount] = useState(total || amount);

//   // Initialize payment data with props and localStorage data
//   useEffect(() => {
//     console.log("RecordPaymentModal props:", { invoiceId, amount, total });
    
//     // First, set initial values from props
//     const initialAmount = parseFloat(amount) || 0;
//     const initialTotal = parseFloat(total) || initialAmount;
    
//     setCurrentRemainingAmount(initialAmount);
//     setOriginalTotalAmount(initialTotal);
//     setFormData(prev => ({ ...prev, amount: initialAmount.toString() }));
    
//     // Then check localStorage for additional/override data
//     try {
//       const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
//       const order = existingOrders.find(o => 
//         o.orderId === invoiceId || o.id === invoiceId || o.POID === invoiceId
//       );

//       if (order) {
//         console.log("Found order in localStorage:", order);
        
//         // Calculate remaining based on payment history if remainingAmount is not set
//         let remaining = order.remainingAmount;
//         let orderTotal = order.total;
        
//         if (remaining === undefined || remaining === null) {
//           // If no remainingAmount field, calculate it from payments
//           const payments = JSON.parse(localStorage.getItem('payments') || '[]');
//           const orderPayments = payments.filter(p => 
//             p.orderId === invoiceId || p.invoiceId === invoiceId
//           );
          
//           const totalPaid = orderPayments.reduce((sum, payment) => sum + payment.amount, 0);
//           remaining = Math.max(0, orderTotal - totalPaid);
//         }
        
//         // Only override props if we have valid data
//         if (remaining !== undefined && remaining !== null) {
//           setCurrentRemainingAmount(remaining);
//           setFormData(prev => ({ ...prev, amount: remaining.toString() }));
//         }
        
//         if (orderTotal !== undefined && orderTotal !== null) {
//           setOriginalTotalAmount(orderTotal);
//         }
        
//         // Check if already paid
//         if (order.paid || order.paymentStatus === 'paid' || remaining <= 0) {
//           setIsAlreadyPaid(true);
//         }
//       }
//     } catch (error) {
//       console.error("Error processing localStorage data:", error);
//     }
//   }, [invoiceId, amount, total]);

//   // Fetch accounts on mount
//   useEffect(() => {
//     fetchAccounts();
//   }, []);

//   const fetchAccounts = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/accounts');
//       const data = await response.json();

//       const assetAccounts = data.filter(acct => acct.type === 'assets');
//       const accountMap = {};
//       assetAccounts.forEach(acct => accountMap[acct.id] = { ...acct, children: [] });

//       assetAccounts.forEach(acct => {
//         if (acct.parentId && accountMap[acct.parentId]) {
//           accountMap[acct.parentId].children.push(accountMap[acct.id]);
//         }
//       });

//       const tree = assetAccounts.filter(acct => !acct.parentId || !accountMap[acct.parentId]);
//       setAccounts(tree);
//     } catch (err) {
//       console.error('Failed to fetch accounts:', err);
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.date) {
//       newErrors.date = 'Payment date is required';
//     }
    
//     const paymentAmount = parseFloat(formData.amount);
//     if (!formData.amount || paymentAmount <= 0) {
//       newErrors.amount = 'Valid payment amount is required';
//     } else if (paymentAmount > currentRemainingAmount) {
//       newErrors.amount = `Payment cannot exceed remaining amount of ${formatCurrency(currentRemainingAmount)}`;
//     }
    
//     if (!formData.method) {
//       newErrors.method = 'Payment method is required';
//     }
    
//     if (!formData.account) {
//       newErrors.account = 'Deposit account is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (isAlreadyPaid) {
//       setErrors({
//         general: 'This invoice has already been fully paid. No further payments allowed.'
//       });
//       return;
//     }

//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       const paymentAmount = parseFloat(formData.amount);
//       const newRemainingAmount = Math.max(0, currentRemainingAmount - paymentAmount);
//       const isFullPayment = newRemainingAmount <= 0;
//       const paymentStatus = isFullPayment ? 'paid' : 'partial';

//       // Create payment record
//       const paymentData = {
//         id: `PAY-${Date.now()}`,
//         customerId: customerId || null,
//         orderId: invoiceId,
//         date: formData.date,
//         amount: paymentAmount,
//         paymentMethod: formData.method,
//         accountId: formData.account,
//         accountName: getAccountNameById(formData.account, accounts) || 'Unknown Account',
//         accountType: getAccountTypeById(formData.account, accounts) || 'Not specified',
//         memo: formData.memo,
//         status: paymentStatus,
//         remainingAmount: newRemainingAmount,
//         createdAt: new Date().toISOString(),
//         createdBy: 'current_user'
//       };

//       // Save payment to localStorage
//       const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
//       const updatedPayments = [...existingPayments, paymentData];
//       localStorage.setItem('payments', JSON.stringify(updatedPayments));

//       // Update order in localStorage
//       const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
//       const orderIndex = existingOrders.findIndex(order =>
//         order.orderId === invoiceId || order.id === invoiceId
//       );

//       if (orderIndex !== -1) {
//         existingOrders[orderIndex] = {
//           ...existingOrders[orderIndex],
//           paid: isFullPayment,
//           paymentStatus: paymentStatus,
//           lastPaymentDate: formData.date,
//           lastPaymentAmount: paymentAmount,
//           remainingAmount: newRemainingAmount,
//           paymentHistory: [
//             ...(existingOrders[orderIndex].paymentHistory || []),
//             paymentData.id
//           ]
//         };
//         localStorage.setItem('orders', JSON.stringify(existingOrders));
//       }

//       // API Call
//       const apiUrl = `https://api-pos.hulmsolutions.com/POS/accountinghamid/bea876f9-b274-4cd2-9f86-d28953bee69d/orders/Paid/${invoiceId}`;
//       const payload = {
//         customerId: customerId,
//         orderId: invoiceId,
//         paid: isFullPayment,
//         billUnitId: "2",
//         billStatus: "pending",
//         amount: paymentAmount,         // ✅ actual amount being paid
//         total: originalTotalAmount     // ✅ full invoice total
//       };

//       const apiResponse = await fetch(apiUrl, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer $hAMID`
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!apiResponse.ok) {
//         throw new Error("Failed to update order status in API");
//       }

//       // Callbacks
//       if (onSubmit) {
//         onSubmit(paymentData, isFullPayment);
//       }

//       if (onPaymentComplete) {
//         onPaymentComplete(paymentData, isFullPayment);
//       }

//       const message = isFullPayment
//         ? "Payment recorded successfully. Invoice is now fully paid."
//         : `Partial payment of ${formatCurrency(paymentAmount)} recorded. Remaining balance: ${formatCurrency(newRemainingAmount)}`;

//       console.log(message);
//       onClose();
//     } catch (error) {
//       console.error("Error recording payment:", error);
//       setErrors({ general: "Failed to record payment. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAccountNameById = (accountId, accountList) => {
//     for (const account of accountList) {
//       if (account.id === accountId) {
//         return account.name;
//       }
//       if (account.children && account.children.length > 0) {
//         const foundInChildren = getAccountNameById(accountId, account.children);
//         if (foundInChildren) return foundInChildren;
//       }
//     }
//     return null;
//   };
  
//   const getAccountTypeById = (accountId, accountList) => {
//     for (const account of accountList) {
//       if (account.id === accountId) {
//         return account.type; // ← will return "assets", "liabilities", etc.
//       }
//       if (account.children && account.children.length > 0) {
//         const foundInChildren = getAccountTypeById(accountId, account.children);
//         if (foundInChildren) return foundInChildren;
//       }
//     }
//     return null;
//   };

//   const renderAccountOptions = (accountList, level = 0) => {
//     return accountList.map(account => (
//       <React.Fragment key={account.id}>
//         <option value={account.id}>
//           {'-'.repeat(level * 2)} {account.code} - {account.name}
//         </option>
//         {account.children && account.children.length > 0 && (
//           renderAccountOptions(account.children, level + 1)
//         )}
//       </React.Fragment>
//     ));
//   };

//   const paymentAmount = parseFloat(formData.amount) || 0;
//   const remainingAmount = Math.max(0, currentRemainingAmount - paymentAmount);
//   const isFullPayment = remainingAmount <= 0 && paymentAmount > 0;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Record a payment for this invoice
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X size={24} />
//             </button>
//           </div>
//         </div>

//         {/* Form Body */}
//         <div className="px-6 py-4 space-y-5">
//           {errors.general && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
//               <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
//               <span className="text-sm text-red-700">{errors.general}</span>
//             </div>
//           )}

//           {/* Show invoice information section */}
//           <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <h3 className="text-sm font-semibold text-blue-800 mb-2">Invoice Information</h3>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="text-xs text-blue-700">Total Bill Amount:</label>
//                 <p className="text-sm font-bold text-blue-900">{formatCurrency(originalTotalAmount)}</p>
//               </div>
//               <div>
//                 <label className="text-xs text-blue-700">Remaining Amount:</label>
//                 <p className="text-sm font-bold text-blue-900">{formatCurrency(currentRemainingAmount)}</p>
//               </div>
//             </div>
//           </div>
            
//           {/* Date Field */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
//               <Calendar size={16} />
//               Date
//             </label>
//             <input
//               type="date"
//               value={formData.date}
//               onChange={(e) => handleChange('date', e.target.value)}
//               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                 errors.date ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors.date && <span className="text-xs text-red-600 mt-1">{errors.date}</span>}
//           </div>

//           {/* Amount Field */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
//               <DollarSign size={16} />
//               Payment Amount
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
//                 Rs
//               </span>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={formData.amount}
//                 onChange={(e) => handleChange('amount', e.target.value)}
//                 className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.amount ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="0.00"
//                 max={currentRemainingAmount}
//               />
//             </div>
//             {errors.amount && <span className="text-xs text-red-600 mt-1">{errors.amount}</span>}
            
//             {paymentAmount > 0 && (
//               <div className="mt-2 text-sm">
//                 {isFullPayment ? (
//                   <span className="text-green-600 font-medium">Invoice will be fully paid</span>
//                 ) : (
//                   <span className="text-orange-600">
//                     Partial payment - Remaining: {formatCurrency(remainingAmount)}
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Payment Method */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
//               <CreditCard size={16} />
//               Method
//             </label>
//             <select
//               value={formData.method}
//               onChange={(e) => handleChange('method', e.target.value)}
//               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                 errors.method ? 'border-red-500' : 'border-gray-300'
//               }`}
//             >
//               <option value="">Select a payment method...</option>
//               <option value="cash">Cash</option>
//               <option value="check">Check</option>
//               <option value="bank_transfer">Bank Transfer</option>
//               <option value="credit_card">Credit Card</option>
//               <option value="debit_card">Debit Card</option>
//               <option value="online">Online Payment</option>
//             </select>
//             {errors.method && <span className="text-xs text-red-600 mt-1">{errors.method}</span>}
//           </div>

//           {/* Account */}
//           <div>
//             <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
//               <FileText size={16} />
//               Account
//             </label>
//             <select
//               value={formData.account}
//               onChange={(e) => handleChange('account', e.target.value)}
//               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                 errors.account ? 'border-red-500' : 'border-gray-300'
//               }`}
//             >
//               <option value="">Select a payment account...</option>
//               {renderAccountOptions(accounts)}
//             </select>
//             {errors.account && <span className="text-xs text-red-600 mt-1">{errors.account}</span>}
//             <p className="text-xs text-gray-500 mt-1">
//               Any account into which you deposit and withdraw funds from.{' '}
//               <a href="#" className="text-blue-600 hover:text-blue-700">Learn more</a>
//             </p>
//           </div>

//           {/* Memo */}
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-1 block">
//               Memo / notes
//             </label>
//             <textarea
//               value={formData.memo}
//               onChange={(e) => handleChange('memo', e.target.value)}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Add any additional notes..."
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading || !formData.amount || parseFloat(formData.amount) <= 0 || parseFloat(formData.amount) > currentRemainingAmount}
//             className={`px-6 py-2 rounded-lg font-medium transition-colors ${
//               loading || !formData.amount || parseFloat(formData.amount) <= 0 || parseFloat(formData.amount) > currentRemainingAmount
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 : 'bg-blue-600 text-white hover:bg-blue-700'
//             }`}
//           >
//             {loading ? 'Processing...' : 'Submit'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecordPaymentModal;