import React from 'react';
import { 
  Calendar, 
  Filter, 
  Search, 
  RefreshCw, 
  X, 
  Plus, 
  FileText 
} from 'lucide-react';
import AccountSelect from './AccountSelect';

const GLControls = ({ 
  filters, 
  setFilters, 
  accounts, 
  loading, 
  onRefresh, 
  onRefreshAccounts, 
  onClearFilters, 
  onAddEntry, 
  onGenerateTrialBalance 
}) => {
  return (
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
        <AccountSelect
          value={filters.accountId}
          onChange={(value) => setFilters({ ...filters, accountId: value })}
          accounts={accounts}
          placeholder="All Accounts"
          showIcon={true}
        />

        {/* Transaction Type Filter */}
        <select
          value={filters.transactionType}
          onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="automatic">Automatic (POS/Purchase)</option>
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
          onClick={onRefresh}
          disabled={loading.entries}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:bg-gray-400"
        >
          {loading.entries ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
          <span>Refresh from API</span>
        </button>
        <button
          onClick={onRefreshAccounts}
          disabled={loading.accounts}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center space-x-2 disabled:bg-gray-400"
        >
          {loading.accounts ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
          <span>Refresh Accounts</span>
        </button>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
        >
          <X size={16} />
          <span>Clear Filters</span>
        </button>
        <button
          onClick={onAddEntry}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Entry</span>
        </button>
        <button
          onClick={onGenerateTrialBalance}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
        >
          <FileText size={16} />
          <span>Trial Balance</span>
        </button>
      </div>
    </div>
  );
};

export default GLControls;