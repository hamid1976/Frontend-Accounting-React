// Get credit status color based on status
export const getCreditStatusColor = (status) => {
  switch (status) {
    case 'excellent': return 'bg-green-100 text-green-800';
    case 'good': return 'bg-blue-100 text-blue-800';
    case 'watch': return 'bg-yellow-100 text-yellow-800';
    case 'hold': return 'bg-red-100 text-red-800';
    case 'cash_only': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Get invoice status color based on status
export const getInvoiceStatusColor = (status) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'outstanding': return 'bg-blue-100 text-blue-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    case 'partial': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};