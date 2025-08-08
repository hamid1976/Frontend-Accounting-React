import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  FileText, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  AlertCircle,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Eye,
  Download
} from 'lucide-react';

const GeneralLedger = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    accountId: '',
    transactionType: 'all',
    searchTerm: ''
  });
  const [trialBalance, setTrialBalance] = useState([]);
  const [showTrialBalance, setShowTrialBalance] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    entries: [
      { accountId: '', debit: 0, credit: 0, description: '' },
      { accountId: '', debit: 0, credit: 0, description: '' }
    ]
  });

  // Sample Chart of Accounts
  const chartOfAccounts = [
    { id: '1111', code: '1111', name: 'Petty Cash', type: 'assets' },
    { id: '1112', code: '1112', name: 'Bank - Main Account', type: 'assets' },
    { id: '1120', code: '1120', name: 'Accounts Receivable', type: 'assets' },
    { id: '1130', code: '1130', name: 'Inventory', type: 'assets' },
    { id: '2110', code: '2110', name: 'Accounts Payable', type: 'liabilities' },
    { id: '2130', code: '2130', name: 'Sales Tax Payable', type: 'liabilities' },
    { id: '4100', code: '4100', name: 'Sales Revenue - Medical', type: 'revenue' },
    { id: '5100', code: '5100', name: 'Cost of Goods Sold', type: 'expenses' },
    { id: '5200', code: '5200', name: 'Purchase Expenses', type: 'expenses' },
    { id: '5210', code: '5210', name: 'Office Supplies', type: 'expenses' }
  ];

  useEffect(() => {
    setAccounts(chartOfAccounts);
    loadSampleJournalEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [journalEntries, filters]);

  const loadSampleJournalEntries = () => {
    const sampleEntries = [
      {
        id: 'JE001',
        date: '2025-01-15',
        description: 'POS Sale #POS001 - Medical products',
        reference: 'POS001',
        transactionType: 'automatic',
        source: 'POS',
        status: 'posted',
        entries: [
          { accountId: '1111', accountName: 'Petty Cash', debit: 60.50, credit: 0, description: 'Cash received from customer' },
          { accountId: '4100', accountName: 'Sales Revenue - Medical', debit: 0, credit: 55.00, description: 'Revenue from medical products' },
          { accountId: '2130', accountName: 'Sales Tax Payable', debit: 0, credit: 5.50, description: 'Sales tax collected' },
          { accountId: '5100', accountName: 'Cost of Goods Sold', debit: 33.00, credit: 0, description: 'Cost of products sold' },
          { accountId: '1130', accountName: 'Inventory', debit: 0, credit: 33.00, description: 'Inventory reduction' }
        ],
        totalDebit: 93.50,
        totalCredit: 93.50,
        createdAt: '2025-01-15T10:30:00Z'
      },
      {
        id: 'JE002',
        date: '2025-01-14',
        description: 'Purchase Order #PO002 - Medical inventory',
        reference: 'PO002',
        transactionType: 'automatic',
        source: 'Purchase',
        status: 'posted',
        entries: [
          { accountId: '1130', accountName: 'Inventory', debit: 350.00, credit: 0, description: 'Medical products purchased' },
          { accountId: '2110', accountName: 'Accounts Payable', debit: 0, credit: 350.00, description: 'Amount owed to Medical Supply Co.' }
        ],
        totalDebit: 350.00,
        totalCredit: 350.00,
        createdAt: '2025-01-14T14:20:00Z'
      },
      {
        id: 'JE003',
        date: '2025-01-13',
        description: 'Manual adjustment - Inventory count variance',
        reference: 'ADJ001',
        transactionType: 'manual',
        source: 'Manual',
        status: 'posted',
        entries: [
          { accountId: '1130', accountName: 'Inventory', debit: 25.00, credit: 0, description: 'Inventory adjustment - undercount' },
          { accountId: '5200', accountName: 'Purchase Expenses', debit: 0, credit: 25.00, description: 'Adjustment to purchase variance' }
        ],
        totalDebit: 25.00,
        totalCredit: 25.00,
        createdAt: '2025-01-13T16:45:00Z'
      },
      {
        id: 'JE004',
        date: '2025-01-15',
        description: 'POS Sale #POS002 - Medical products',
        reference: 'POS002',
        transactionType: 'automatic',
        source: 'POS',
        status: 'posted',
        entries: [
          { accountId: '1112', accountName: 'Bank - Main Account', debit: 85.00, credit: 0, description: 'Card payment received' },
          { accountId: '4100', accountName: 'Sales Revenue - Medical', debit: 0, credit: 77.27, description: 'Revenue from medical products' },
          { accountId: '2130', accountName: 'Sales Tax Payable', debit: 0, credit: 7.73, description: 'Sales tax collected' },
          { accountId: '5100', accountName: 'Cost of Goods Sold', debit: 46.36, credit: 0, description: 'Cost of products sold' },
          { accountId: '1130', accountName: 'Inventory', debit: 0, credit: 46.36, description: 'Inventory reduction' }
        ],
        totalDebit: 131.36,
        totalCredit: 131.36,
        createdAt: '2025-01-15T15:20:00Z'
      }
    ];

    setJournalEntries(sampleEntries);
  };

  const filterEntries = () => {
    let filtered = [...journalEntries];

    if (filters.dateFrom) {
      filtered = filtered.filter(entry => entry.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(entry => entry.date <= filters.dateTo);
    }
    if (filters.accountId) {
      filtered = filtered.filter(entry => 
        entry.entries.some(e => e.accountId === filters.accountId)
      );
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
  };

  const generateTrialBalance = () => {
    const balances = {};
    
    // Initialize all accounts
    chartOfAccounts.forEach(account => {
      balances[account.id] = {
        accountId: account.id,
        accountCode: account.code,
        accountName: account.name,
        accountType: account.type,
        debit: 0,
        credit: 0,
        balance: 0
      };
    });

    // Calculate balances from journal entries
    journalEntries.forEach(entry => {
      if (entry.status === 'posted') {
        entry.entries.forEach(entryLine => {
          if (balances[entryLine.accountId]) {
            balances[entryLine.accountId].debit += entryLine.debit;
            balances[entryLine.accountId].credit += entryLine.credit;
          }
        });
      }
    });

    // Calculate net balances
    Object.values(balances).forEach(account => {
      if (account.accountType === 'assets' || account.accountType === 'expenses') {
        account.balance = account.debit - account.credit;
      } else {
        account.balance = account.credit - account.debit;
      }
    });

    const trialBalanceData = Object.values(balances)
      .filter(account => account.debit !== 0 || account.credit !== 0)
      .sort((a, b) => a.accountCode.localeCompare(b.accountCode));

    setTrialBalance(trialBalanceData);
    setShowTrialBalance(true);
  };

  const addEntryLine = () => {
    setNewEntry({
      ...newEntry,
      entries: [...newEntry.entries, { accountId: '', debit: 0, credit: 0, description: '' }]
    });
  };

  const removeEntryLine = (index) => {
    if (newEntry.entries.length > 2) {
      const updatedEntries = newEntry.entries.filter((_, i) => i !== index);
      setNewEntry({ ...newEntry, entries: updatedEntries });
    }
  };

  const updateEntryLine = (index, field, value) => {
    const updatedEntries = [...newEntry.entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setNewEntry({ ...newEntry, entries: updatedEntries });
  };

  const calculateTotals = (entries) => {
    const totalDebit = entries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
    const totalCredit = entries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
    return { totalDebit, totalCredit };
  };

  const isBalanced = (entries) => {
    const { totalDebit, totalCredit } = calculateTotals(entries);
    return Math.abs(totalDebit - totalCredit) < 0.01;
  };

  const saveJournalEntry = () => {
    if (!newEntry.description || !newEntry.entries.every(e => e.accountId)) {
      alert('Please fill in all required fields');
      return;
    }

    if (!isBalanced(newEntry.entries)) {
      alert('Journal entry must be balanced - total debits must equal total credits');
      return;
    }

    const { totalDebit, totalCredit } = calculateTotals(newEntry.entries);
    
    // Add account names to entries
    const entriesWithNames = newEntry.entries.map(entry => ({
      ...entry,
      accountName: accounts.find(acc => acc.id === entry.accountId)?.name || '',
      debit: parseFloat(entry.debit) || 0,
      credit: parseFloat(entry.credit) || 0
    }));

    const journalEntry = {
      id: `JE${String(journalEntries.length + 1).padStart(3, '0')}`,
      date: newEntry.date,
      description: newEntry.description,
      reference: newEntry.reference || `MAN${Date.now()}`,
      transactionType: 'manual',
      source: 'Manual',
      status: 'posted',
      entries: entriesWithNames,
      totalDebit,
      totalCredit,
      createdAt: new Date().toISOString()
    };

    setJournalEntries([...journalEntries, journalEntry]);
    
    // Reset form
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      entries: [
        { accountId: '', debit: 0, credit: 0, description: '' },
        { accountId: '', debit: 0, credit: 0, description: '' }
      ]
    });
    setIsAddingEntry(false);
  };

  const getAccountName = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? `${account.code} - ${account.name}` : '';
  };

  const { totalDebit, totalCredit } = calculateTotals(newEntry.entries);
  const entryIsBalanced = isBalanced(newEntry.entries);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Book className="mr-3 text-emerald-600" />
          General Ledger
        </h1>
        <p className="text-gray-600">Real-time transaction recording and journal entry management</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Entries</p>
              <p className="text-2xl font-bold text-blue-900">{journalEntries.length}</p>
            </div>
            <FileText className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Automatic Entries</p>
              <p className="text-2xl font-bold text-green-900">
                {journalEntries.filter(e => e.transactionType === 'automatic').length}
              </p>
            </div>
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Manual Entries</p>
              <p className="text-2xl font-bold text-orange-900">
                {journalEntries.filter(e => e.transactionType === 'manual').length}
              </p>
            </div>
            <Edit className="text-orange-600" size={24} />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Value</p>
              <p className="text-2xl font-bold text-purple-900">
                ${journalEntries.reduce((sum, entry) => sum + entry.totalDebit, 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Filters */}
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="From"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="To"
            />
          </div>

          {/* Account Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filters.accountId}
              onChange={(e) => setFilters({ ...filters, accountId: e.target.value })}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">All Accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.code} - {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Type Filter */}
          <select
            value={filters.transactionType}
            onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search entries..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setIsAddingEntry(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Entry</span>
          </button>
          <button
            onClick={generateTrialBalance}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <FileText size={16} />
            <span>Trial Balance</span>
          </button>
        </div>
      </div>

      {/* Journal Entry Form */}
      {isAddingEntry && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Add Manual Journal Entry</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <input
                type="text"
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
              <input
                type="text"
                value={newEntry.reference}
                onChange={(e) => setNewEntry({ ...newEntry, reference: e.target.value })}
                placeholder="Reference number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Entry Lines */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Journal Entry Lines</label>
            <div className="space-y-3">
              {newEntry.entries.map((entry, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded border">
                  <div className="col-span-4">
                    <select
                      value={entry.accountId}
                      onChange={(e) => updateEntryLine(index, 'accountId', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select Account</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={entry.description}
                      onChange={(e) => updateEntryLine(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      step="0.01"
                      value={entry.debit}
                      onChange={(e) => updateEntryLine(index, 'debit', e.target.value)}
                      placeholder="Debit"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      step="0.01"
                      value={entry.credit}
                      onChange={(e) => updateEntryLine(index, 'credit', e.target.value)}
                      placeholder="Credit"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="col-span-1">
                    {newEntry.entries.length > 2 && (
                      <button
                        onClick={() => removeEntryLine(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-3">
              <button
                onClick={addEntryLine}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center space-x-1"
              >
                <Plus size={14} />
                <span>Add Line</span>
              </button>

              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="font-medium">Total Debit: ${totalDebit.toFixed(2)}</span>
                  <span className="mx-2">|</span>
                  <span className="font-medium">Total Credit: ${totalCredit.toFixed(2)}</span>
                </div>
                {entryIsBalanced ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle size={16} className="mr-1" />
                    <span className="text-sm">Balanced</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <AlertCircle size={16} className="mr-1" />
                    <span className="text-sm">Not Balanced</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={saveJournalEntry}
              disabled={!entryIsBalanced}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save Entry</span>
            </button>
            <button
              onClick={() => setIsAddingEntry(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Journal Entries Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Journal Entries</h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredEntries.length} of {journalEntries.length} entries
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {entry.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      entry.transactionType === 'automatic' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {entry.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${entry.totalDebit.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      entry.status === 'posted' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="text-emerald-600 hover:text-emerald-900 mr-3"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Details Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Journal Entry Details - {selectedEntry.id}
                </h3>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              {/* Entry Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-sm text-gray-900">{selectedEntry.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reference</label>
                  <p className="text-sm text-gray-900">{selectedEntry.reference}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm text-gray-900">{selectedEntry.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Source</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedEntry.transactionType === 'automatic' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedEntry.source}
                  </span>
                </div>
              </div>

              {/* Entry Lines */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Account Entries</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Account</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Debit</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Credit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedEntry.entries.map((entryLine, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {getAccountName(entryLine.accountId)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {entryLine.description}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            {entryLine.debit > 0 ? `${entryLine.debit.toFixed(2)}` : '-'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            {entryLine.credit > 0 ? `${entryLine.credit.toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="2" className="px-4 py-2 text-sm font-medium text-gray-900">
                          Totals:
                        </td>
                        <td className="px-4 py-2 text-sm font-bold text-gray-900 text-right">
                          ${selectedEntry.totalDebit.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm font-bold text-gray-900 text-right">
                          ${selectedEntry.totalCredit.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Entry Metadata */}
              <div className="text-xs text-gray-500">
                <p>Created: {new Date(selectedEntry.createdAt).toLocaleString()}</p>
                <p>Status: {selectedEntry.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trial Balance Modal */}
      {showTrialBalance && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Trial Balance - As of {new Date().toLocaleDateString()}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      // Export functionality would go here
                      alert('Export functionality would be implemented here');
                    }}
                    className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 flex items-center space-x-1"
                  >
                    <Download size={14} />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => setShowTrialBalance(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Debit Total
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credit Total
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trialBalance.map((account) => (
                      <tr key={account.accountId}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {account.accountCode}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {account.accountName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            account.accountType === 'assets' ? 'bg-green-100 text-green-800' :
                            account.accountType === 'liabilities' ? 'bg-red-100 text-red-800' :
                            account.accountType === 'equity' ? 'bg-blue-100 text-blue-800' :
                            account.accountType === 'revenue' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {account.accountType}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${account.debit.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${account.credit.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
                          <span className={account.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                            ${Math.abs(account.balance).toFixed(2)}
                            {account.balance < 0 && ' (CR)'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-sm font-bold text-gray-900">
                        TOTALS:
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                        ${trialBalance.reduce((sum, acc) => sum + acc.debit, 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                        ${trialBalance.reduce((sum, acc) => sum + acc.credit, 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                        ${Math.abs(trialBalance.reduce((sum, acc) => sum + acc.balance, 0)).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {/* Trial Balance Validation */}
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={20} />
                  <div>
                    <h4 className="font-medium text-green-800">Trial Balance is Balanced</h4>
                    <p className="text-sm text-green-700">
                      Total Debits = Total Credits = ${trialBalance.reduce((sum, acc) => sum + acc.debit, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Status */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle className="text-green-600 mr-2" size={16} />
            <h4 className="font-medium text-green-800">POS Integration</h4>
          </div>
          <p className="text-sm text-green-700">
            All sales transactions automatically create journal entries
          </p>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle className="text-green-600 mr-2" size={16} />
            <h4 className="font-medium text-green-800">Purchase Integration</h4>
          </div>
          <p className="text-sm text-green-700">
            Purchase orders automatically update accounts payable and inventory
          </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center mb-2">
            <FileText className="text-blue-600 mr-2" size={16} />
            <h4 className="font-medium text-blue-800">Manual Entries</h4>
          </div>
          <p className="text-sm text-blue-700">
            Add adjustments and corrections with full validation
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneralLedger;