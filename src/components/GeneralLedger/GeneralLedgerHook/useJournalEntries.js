import { useState, useCallback } from 'react';
import { API_CONFIG } from '../../../utils/apiConfig';
import { 
  fetchSalesOrderData, 
  fetchPurchaseOrderData,
  convertSalesOrderToJournalEntry,
  convertPurchaseOrderToJournalEntry
} from '../GeneralLedgerUtil/journalEntryConverters';

export const useJournalEntries = (accounts) => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ entries: null, purchase: null });
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    entries: [
      { accountId: '', debit: 0, credit: 0, description: '' },
      { accountId: '', debit: 0, credit: 0, description: '' }
    ]
  });

  const loadJournalEntriesFromAPI = useCallback(async () => {
    setLoading(true);
    setErrors({ entries: null, purchase: null });
    
    try {
      // Fetch both sales and purchase orders in parallel
      const [salesOrders, purchaseOrders] = await Promise.all([
        fetchSalesOrderData(),
        fetchPurchaseOrderData()
      ]);
      
      let allJournalEntries = [];
      
      // Process sales orders
      if (salesOrders && Array.isArray(salesOrders)) {
        const journalEntriesFromSales = salesOrders
          .filter(order => order.paid && order.fulfilled && order.status === 'Closed')
          .map(order => convertSalesOrderToJournalEntry(order, accounts))
          .filter(entry => entry !== null);
        
        allJournalEntries = [...allJournalEntries, ...journalEntriesFromSales];
        console.log(`Processed ${journalEntriesFromSales.length} sales journal entries`);
      }
      
      // Process purchase orders
      if (purchaseOrders && Array.isArray(purchaseOrders)) {
        const journalEntriesFromPurchases = purchaseOrders
          .map(order => convertPurchaseOrderToJournalEntry(order, accounts))
          .filter(entry => entry !== null);
        
        allJournalEntries = [...allJournalEntries, ...journalEntriesFromPurchases];
        console.log(`Processed ${journalEntriesFromPurchases.length} purchase journal entries`);
      }
      
      // Load manual entries from localStorage
      let manualEntries = [];
      try {
        const storedEntries = localStorage.getItem('manualJournalEntries');
        manualEntries = storedEntries ? JSON.parse(storedEntries) : [];
      } catch (error) {
        console.warn('Error loading manual entries from localStorage:', error);
        manualEntries = [];
      }
      
      allJournalEntries = [...allJournalEntries, ...manualEntries];
      
      // Sort by date
      allJournalEntries.sort((a, b) => b.date.localeCompare(a.date));
      
      setJournalEntries(allJournalEntries);
      setFilteredEntries(allJournalEntries);
      setLoading(false);
      
      console.log(`Total journal entries loaded: ${allJournalEntries.length}`);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      setErrors({ entries: error.message, purchase: null });
      setLoading(false);
    }
  }, [accounts]);

  const filterEntries = useCallback((filters) => {
    let filtered = [...journalEntries];

    if (filters.dateFrom) {
      filtered = filtered.filter(entry => entry.date >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(entry => entry.date <= filters.dateTo);
    }
    
    if (filters.accountId) {
      filtered = filtered.filter(entry => {
        return entry.entries.some(e => e.accountId === filters.accountId);
      });
    }
    
    if (filters.transactionType !== 'all') {
      filtered = filtered.filter(entry => entry.transactionType === filters.transactionType);
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.description.toLowerCase().includes(term) ||
        entry.reference.toLowerCase().includes(term) ||
        entry.entries.some(e => e.description.toLowerCase().includes(term))
      );
    }

    setFilteredEntries(filtered);
  }, [journalEntries]);

  const saveJournalEntry = useCallback((entryData) => {
    if (!entryData.description || !entryData.entries.every(e => e.accountId)) {
      alert('Please fill in all required fields');
      return false;
    }

    const { totalDebit, totalCredit } = entryData.entries.reduce(
      (acc, entry) => ({
        totalDebit: acc.totalDebit + (parseFloat(entry.debit) || 0),
        totalCredit: acc.totalCredit + (parseFloat(entry.credit) || 0)
      }),
      { totalDebit: 0, totalCredit: 0 }
    );

    if (Math.abs(totalDebit - totalCredit) >= 0.01) {
      alert('Journal entry must be balanced - total debits must equal total credits');
      return false;
    }
    
    const entriesWithNames = entryData.entries.map(entry => ({
      ...entry,
      accountName: accounts.find(acc => acc.id === entry.accountId)?.name || '',
      debit: parseFloat(entry.debit) || 0,
      credit: parseFloat(entry.credit) || 0
    }));

    const journalEntry = {
      id: `JE-MANUAL-${Date.now()}`,
      date: entryData.date,
      description: entryData.description,
      reference: entryData.reference || `MAN${Date.now()}`,
      transactionType: 'manual',
      source: 'Manual',
      status: 'posted',
      entries: entriesWithNames,
      totalDebit,
      totalCredit,
      createdAt: new Date().toISOString()
    };

    try {
      const existingManualEntries = JSON.parse(localStorage.getItem('manualJournalEntries') || '[]');
      const updatedManualEntries = [...existingManualEntries, journalEntry];
      localStorage.setItem('manualJournalEntries', JSON.stringify(updatedManualEntries));
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }

    setJournalEntries([...journalEntries, journalEntry]);
    
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      entries: [
        { accountId: '', debit: 0, credit: 0, description: '' },
        { accountId: '', debit: 0, credit: 0, description: '' }
      ]
    });
    
    return true;
  }, [accounts, journalEntries]);

  const getAccountName = useCallback((accountId) => {
    const account = accounts.find(acc => acc.id === accountId || acc.code === accountId);
    
    if (account) {
      return `${account.code} - ${account.name}`;
    }
    
    let accountName = '';
    
    journalEntries.forEach(entry => {
      entry.entries.forEach(entryLine => {
        if (entryLine.accountId === accountId && entryLine.accountName) {
          accountName = entryLine.accountName;
        }
      });
    });
    
    if (accountName) {
      return `${accountId} - ${accountName}`;
    }
    
    const prefix = accountId.toString().substring(0, 1);
    let accountType = '';
    
    if (prefix === '1') accountType = 'Assets';
    else if (prefix === '2') accountType = 'Liabilities';
    else if (prefix === '3') accountType = 'Equity';
    else if (prefix === '4') accountType = 'Revenue';
    else if (prefix === '5') accountType = 'Expenses';
    
    return accountType ? `${accountId} - ${accountType} Account` : `${accountId} - Unknown Account`;
  }, [accounts, journalEntries]);

  return {
    journalEntries,
    filteredEntries,
    newEntry,
    setNewEntry,
    loading,
    errors,
    loadJournalEntriesFromAPI,
    filterEntries,
    saveJournalEntry,
    getAccountName
  };
};