// Helper function to flatten hierarchy for filtering
export const flattenAccounts = (accounts) => {
  const result = [];
  const flatten = (items) => {
    items.forEach(item => {
      result.push(item);
      if (item.children && item.children.length > 0) {
        flatten(item.children);
      }
    });
  };
  flatten(accounts);
  return result;
};

// Filter accounts based on search and category
export const getFilteredAccounts = (flatAccounts, searchTerm, selectedCategory) => {
  let filtered = flatAccounts;

  if (searchTerm) {
    filtered = filtered.filter(account => 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.includes(searchTerm) ||
      (account.description && account.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  if (selectedCategory !== 'all') {
    filtered = filtered.filter(account => account.type === selectedCategory);
  }

  return filtered;
};

// Build hierarchy from flat accounts (for display when not searching)
export const buildHierarchy = (accounts, parentId = null) => {
  return accounts
    .filter(account => account.parentId === parentId)
    .sort((a, b) => a.code.localeCompare(b.code))
    .map(account => ({
      ...account,
      children: buildHierarchy(accounts, account.id)
    }));
};