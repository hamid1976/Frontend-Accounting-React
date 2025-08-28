// Calculate totals for journal entries
export const calculateTotals = (entries) => {
  const totalDebit = entries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
  const totalCredit = entries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
  return { totalDebit, totalCredit };
};

// Check if entries are balanced
export const isBalanced = (entries) => {
  const { totalDebit, totalCredit } = calculateTotals(entries);
  return Math.abs(totalDebit - totalCredit) < 0.01;
};