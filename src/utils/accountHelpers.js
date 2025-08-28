// Helper function to flatten hierarchical account structure
export const flattenAccounts = (accounts) => {
  const result = [];
  
  const processAccount = (account) => {
    result.push(account);
    
    if (account.children && Array.isArray(account.children)) {
      account.children.forEach(child => processAccount(child));
    }
  };
  
  accounts.forEach(account => processAccount(account));
  return result;
};

// Find account by type
export const findAccountByType = (accountsList, type, preferredId = null) => {
  if (preferredId) {
    const specificAccount = accountsList.find(acc => acc.id === preferredId);
    if (specificAccount) return specificAccount;
  }
  
  const matchingAccount = accountsList.find(acc => 
    acc.type && acc.type.toLowerCase() === type.toLowerCase()
  );
  
  if (matchingAccount) return matchingAccount;
  
  return { 
    id: 'UNKNOWN', 
    name: `Unknown ${type} Account`, 
    code: 'N/A' 
  };
};