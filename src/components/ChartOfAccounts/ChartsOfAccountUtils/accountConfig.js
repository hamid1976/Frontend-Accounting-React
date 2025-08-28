// Account types configuration
export const accountTypes = {
  assets: { 
    label: 'Assets', 
    color: 'bg-green-100 text-green-800', 
    codeRange: '1000-1999' 
  },
  liabilities: { 
    label: 'Liabilities', 
    color: 'bg-red-100 text-red-800', 
    codeRange: '2000-2999' 
  },
  equity: { 
    label: 'Equity', 
    color: 'bg-blue-100 text-blue-800', 
    codeRange: '3000-3999' 
  },
  revenue: { 
    label: 'Revenue', 
    color: 'bg-purple-100 text-purple-800', 
    codeRange: '4000-4999' 
  },
  expenses: { 
    label: 'Expenses', 
    color: 'bg-orange-100 text-orange-800', 
    codeRange: '5000-5999' 
  }
};

// API Base URL
export const API_BASE_URL = 'http://localhost:8080/api/accounts';