import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, Save, X, Search, Filter } from 'lucide-react';

const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'assets',
    category: 'account',
    parentId: null,
    description: '',
    isActive: true
  });

  // Initialize with default account structure
  useEffect(() => {
    const defaultAccounts = [
      // Assets
      { id: '1000', code: '1000', name: 'Assets', type: 'assets', category: 'header', parentId: null, level: 0, isActive: true, description: 'All company assets' },
      { id: '1100', code: '1100', name: 'Current Assets', type: 'assets', category: 'group', parentId: '1000', level: 1, isActive: true, description: 'Assets expected to be converted to cash within one year' },
      { id: '1110', code: '1110', name: 'Cash and Cash Equivalents', type: 'assets', category: 'account', parentId: '1100', level: 2, isActive: true, description: 'Cash in hand and bank accounts' },
      { id: '1111', code: '1111', name: 'Petty Cash', type: 'assets', category: 'account', parentId: '1110', level: 3, isActive: true, description: 'Small cash amounts for daily expenses' },
      { id: '1112', code: '1112', name: 'Bank - Main Account', type: 'assets', category: 'account', parentId: '1110', level: 3, isActive: true, description: 'Primary business bank account' },
      { id: '1120', code: '1120', name: 'Accounts Receivable', type: 'assets', category: 'account', parentId: '1100', level: 2, isActive: true, description: 'Money owed by customers' },
      { id: '1130', code: '1130', name: 'Inventory', type: 'assets', category: 'account', parentId: '1100', level: 2, isActive: true, description: 'Products held for sale' },
      { id: '1200', code: '1200', name: 'Fixed Assets', type: 'assets', category: 'group', parentId: '1000', level: 1, isActive: true, description: 'Long-term assets used in business operations' },
      { id: '1210', code: '1210', name: 'Equipment', type: 'assets', category: 'account', parentId: '1200', level: 2, isActive: true, description: 'Business equipment and machinery' },
      { id: '1220', code: '1220', name: 'Accumulated Depreciation - Equipment', type: 'assets', category: 'account', parentId: '1200', level: 2, isActive: true, description: 'Accumulated depreciation on equipment' },

      // Liabilities
      { id: '2000', code: '2000', name: 'Liabilities', type: 'liabilities', category: 'header', parentId: null, level: 0, isActive: true, description: 'All company liabilities' },
      { id: '2100', code: '2100', name: 'Current Liabilities', type: 'liabilities', category: 'group', parentId: '2000', level: 1, isActive: true, description: 'Debts due within one year' },
      { id: '2110', code: '2110', name: 'Accounts Payable', type: 'liabilities', category: 'account', parentId: '2100', level: 2, isActive: true, description: 'Money owed to suppliers' },
      { id: '2120', code: '2120', name: 'Accrued Expenses', type: 'liabilities', category: 'account', parentId: '2100', level: 2, isActive: true, description: 'Expenses incurred but not yet paid' },
      { id: '2130', code: '2130', name: 'Sales Tax Payable', type: 'liabilities', category: 'account', parentId: '2100', level: 2, isActive: true, description: 'Sales tax collected from customers' },

      // Equity
      { id: '3000', code: '3000', name: 'Equity', type: 'equity', category: 'header', parentId: null, level: 0, isActive: true, description: 'Owner equity in the business' },
      { id: '3100', code: '3100', name: 'Owner Equity', type: 'equity', category: 'account', parentId: '3000', level: 1, isActive: true, description: 'Owner investment in business' },
      { id: '3200', code: '3200', name: 'Retained Earnings', type: 'equity', category: 'account', parentId: '3000', level: 1, isActive: true, description: 'Accumulated profits retained in business' },

      // Revenue
      { id: '4000', code: '4000', name: 'Revenue', type: 'revenue', category: 'header', parentId: null, level: 0, isActive: true, description: 'All company revenue' },
      { id: '4100', code: '4100', name: 'Sales Revenue', type: 'revenue', category: 'account', parentId: '4000', level: 1, isActive: true, description: 'Revenue from product sales' },
      { id: '4200', code: '4200', name: 'Service Revenue', type: 'revenue', category: 'account', parentId: '4000', level: 1, isActive: true, description: 'Revenue from services provided' },

      // Expenses
      { id: '5000', code: '5000', name: 'Expenses', type: 'expenses', category: 'header', parentId: null, level: 0, isActive: true, description: 'All company expenses' },
      { id: '5100', code: '5100', name: 'Cost of Goods Sold', type: 'expenses', category: 'account', parentId: '5000', level: 1, isActive: true, description: 'Direct costs of products sold' },
      { id: '5200', code: '5200', name: 'Operating Expenses', type: 'expenses', category: 'group', parentId: '5000', level: 1, isActive: true, description: 'Day-to-day business operating expenses' },
      { id: '5210', code: '5210', name: 'Rent Expense', type: 'expenses', category: 'account', parentId: '5200', level: 2, isActive: true, description: 'Monthly rent payments' },
      { id: '5220', code: '5220', name: 'Utilities Expense', type: 'expenses', category: 'account', parentId: '5200', level: 2, isActive: true, description: 'Electricity, water, internet costs' },
      { id: '5230', code: '5230', name: 'Salaries and Wages', type: 'expenses', category: 'account', parentId: '5200', level: 2, isActive: true, description: 'Employee compensation' },
    ];

    setAccounts(defaultAccounts);
    // Expand main categories by default
    setExpandedNodes(new Set(['1000', '2000', '3000', '4000', '5000']));
  }, []);

  const accountTypes = {
    assets: { label: 'Assets', color: 'bg-green-100 text-green-800', codeRange: '1000-1999' },
    liabilities: { label: 'Liabilities', color: 'bg-red-100 text-red-800', codeRange: '2000-2999' },
    equity: { label: 'Equity', color: 'bg-blue-100 text-blue-800', codeRange: '3000-3999' },
    revenue: { label: 'Revenue', color: 'bg-purple-100 text-purple-800', codeRange: '4000-4999' },
    expenses: { label: 'Expenses', color: 'bg-orange-100 text-orange-800', codeRange: '5000-5999' }
  };

  const getFilteredAccounts = () => {
    let filtered = accounts;

    if (searchTerm) {
      filtered = filtered.filter(account => 
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.code.includes(searchTerm) ||
        account.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(account => account.type === selectedCategory);
    }

    return filtered;
  };

  const buildHierarchy = (accounts, parentId = null) => {
    return accounts
      .filter(account => account.parentId === parentId)
      .sort((a, b) => a.code.localeCompare(b.code))
      .map(account => ({
        ...account,
        children: buildHierarchy(accounts, account.id)
      }));
  };

  const toggleExpand = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleAddAccount = (parentId = null) => {
    const parentAccount = parentId ? accounts.find(a => a.id === parentId) : null;
    const accountType = parentAccount ? parentAccount.type : 'assets';
    
    setFormData({
      code: generateAccountCode(accountType, parentId),
      name: '',
      type: accountType,
      category: 'account',
      parentId,
      description: '',
      isActive: true
    });
    setIsAddingAccount(true);
  };

  const handleEditAccount = (account) => {
    setFormData({
      code: account.code,
      name: account.name,
      type: account.type,
      category: account.category,
      parentId: account.parentId,
      description: account.description || '',
      isActive: account.isActive
    });
    setEditingAccount(account.id);
  };

  const generateAccountCode = (type, parentId = null) => {
    const typeRanges = {
      assets: { start: 1000, end: 1999 },
      liabilities: { start: 2000, end: 2999 },
      equity: { start: 3000, end: 3999 },
      revenue: { start: 4000, end: 4999 },
      expenses: { start: 5000, end: 5999 }
    };

    let baseCode = typeRanges[type].start;
    
    if (parentId) {
      const parent = accounts.find(a => a.id === parentId);
      if (parent) {
        const siblingCodes = accounts
          .filter(a => a.parentId === parentId)
          .map(a => parseInt(a.code))
          .sort((a, b) => a - b);
        
        if (siblingCodes.length > 0) {
          baseCode = Math.max(...siblingCodes) + 1;
        } else {
          baseCode = parseInt(parent.code) + 10;
        }
      }
    } else {
      const existingCodes = accounts
        .filter(a => a.type === type)
        .map(a => parseInt(a.code))
        .sort((a, b) => a - b);
      
      if (existingCodes.length > 0) {
        baseCode = Math.max(...existingCodes) + 100;
      }
    }

    return baseCode.toString();
  };

  const handleSaveAccount = () => {
    if (!formData.code || !formData.name) {
      alert('Please fill in required fields (Code and Name)');
      return;
    }

    // Check for duplicate codes
    if (accounts.some(a => a.code === formData.code && a.id !== editingAccount)) {
      alert('Account code already exists');
      return;
    }

    if (editingAccount) {
      // Edit existing account
      setAccounts(accounts.map(account => 
        account.id === editingAccount 
          ? { ...account, ...formData }
          : account
      ));
      setEditingAccount(null);
    } else {
      // Add new account
      const newId = (Math.max(...accounts.map(a => parseInt(a.id))) + 1).toString();
      const parentLevel = formData.parentId 
        ? accounts.find(a => a.id === formData.parentId)?.level || 0
        : 0;
      
      const newAccount = {
        id: newId,
        ...formData,
        level: parentLevel + 1
      };
      
      setAccounts([...accounts, newAccount]);
      setIsAddingAccount(false);
    }

    // Reset form
    setFormData({
      code: '',
      name: '',
      type: 'assets',
      category: 'account',
      parentId: null,
      description: '',
      isActive: true
    });
  };

  const handleDeleteAccount = (accountId) => {
    // Check if account has children
    const hasChildren = accounts.some(a => a.parentId === accountId);
    if (hasChildren) {
      alert('Cannot delete account with sub-accounts. Please delete sub-accounts first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(a => a.id !== accountId));
    }
  };

  const handleCancel = () => {
    setIsAddingAccount(false);
    setEditingAccount(null);
    setFormData({
      code: '',
      name: '',
      type: 'assets',
      category: 'account',
      parentId: null,
      description: '',
      isActive: true
    });
  };

  const renderAccountNode = (account) => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedNodes.has(account.id);
    const typeConfig = accountTypes[account.type];

    return (
      <div key={account.id} className="account-node">
        <div 
          className={`flex items-center py-2 px-4 hover:bg-gray-50 border-l-4 ${
            account.category === 'header' ? 'border-gray-400 bg-gray-100 font-bold' :
            account.category === 'group' ? 'border-gray-300 bg-gray-50 font-semibold' :
            'border-transparent'
          }`}
          style={{ paddingLeft: `${account.level * 20 + 16}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpand(account.id)}
              className="mr-2 p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          <div className="flex-1 flex items-center space-x-4">
            <span className="font-mono text-sm text-gray-600 min-w-[80px]">
              {account.code}
            </span>
            
            <span className={`flex-1 ${account.category === 'header' ? 'text-lg' : ''}`}>
              {account.name}
            </span>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
              {typeConfig.label}
            </span>
            
            {account.category !== 'header' && (
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditAccount(account)}
                  className="p-1 hover:bg-blue-100 rounded text-blue-600"
                  title="Edit Account"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                  disabled={account.category === 'header'}
                  title="Delete Account"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => handleAddAccount(account.id)}
                  className="p-1 hover:bg-green-100 rounded text-green-600"
                  title="Add Sub-Account"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {account.description && (
          <div className="px-4 py-1 text-sm text-gray-500" style={{ paddingLeft: `${account.level * 20 + 36}px` }}>
            {account.description}
          </div>
        )}

        {isExpanded && hasChildren && (
          <div>
            {account.children.map(child => renderAccountNode(child))}
          </div>
        )}
      </div>
    );
  };

  const filteredAccounts = getFilteredAccounts();
  const hierarchicalAccounts = buildHierarchy(filteredAccounts);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chart of Accounts</h1>
        <p className="text-gray-600">Manage your company's account structure and hierarchy</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {Object.entries(accountTypes).map(([key, type]) => (
                <option key={key} value={key}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => handleAddAccount()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Account</span>
        </button>
      </div>

      {/* Account Form */}
      {(isAddingAccount || editingAccount) && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">
            {editingAccount ? 'Edit Account' : 'Add New Account'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="Enter account code"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter account name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(accountTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.label} ({type.codeRange})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="header">Header</option>
                <option value="group">Group</option>
                <option value="account">Account</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Account
              </label>
              <select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({...formData, parentId: e.target.value || null})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">None (Top Level)</option>
                {accounts
                  .filter(a => a.id !== editingAccount && a.category !== 'account')
                  .map(account => (
                    <option key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </option>
                  ))
                }
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
            
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
                placeholder="Enter account description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleSaveAccount}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Accounts Tree */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Account Structure</h2>
            <span className="text-sm text-gray-500">
              {filteredAccounts.length} accounts
            </span>
          </div>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto">
          {hierarchicalAccounts.length > 0 ? (
            hierarchicalAccounts.map(account => renderAccountNode(account))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No accounts found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Account Type Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Account Types & Code Ranges</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(accountTypes).map(([key, type]) => (
            <div key={key} className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${type.color}`}>
                {type.label}
              </span>
              <span className="text-sm text-gray-600 font-mono">{type.codeRange}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Quick Actions Guide</h3>
        <div className="text-xs text-blue-700 space-y-1">
          <p>• Click the expand/collapse arrow to show/hide sub-accounts</p>
          <p>• Use the Edit button to modify account details</p>
          <p>• Use the Plus button to add a sub-account under any account</p>
          <p>• Delete accounts that have no sub-accounts or transactions</p>
          <p>• Search by account code, name, or description</p>
          <p>• Filter by account type to focus on specific categories</p>
        </div>
      </div>
    </div>
  );
};

export default ChartOfAccounts;