import React from 'react';
import { RefreshCw } from 'lucide-react';
import AccountNode from './AccountNode';

const COAAccountTree = ({
  accounts,
  displayAccounts,
  filteredAccounts,
  expandedNodes,
  searchTerm,
  selectedCategory,
  loading,
  onToggleExpand,
  onEditAccount,
  onDeleteAccount,
  onAddAccount
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Account Structure</h2>
          <span className="text-sm text-gray-500">
            {filteredAccounts.length} accounts
            {loading && <span className="ml-2 text-blue-600">Loading...</span>}
          </span>
        </div>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto">
        {loading && accounts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
            Loading accounts...
          </div>
        ) : displayAccounts.length > 0 ? (
          searchTerm || selectedCategory !== 'all' ? (
            // Flat view for search results
            <div>
              {filteredAccounts.map(account => (
                <AccountNode
                  key={account.id}
                  account={{...account, children: []}}
                  expandedNodes={expandedNodes}
                  onToggleExpand={onToggleExpand}
                  onEditAccount={onEditAccount}
                  onDeleteAccount={onDeleteAccount}
                  onAddAccount={onAddAccount}
                  loading={loading}
                />
              ))}
            </div>
          ) : (
            // Hierarchical view
            displayAccounts.map(account => (
              <AccountNode
                key={account.id}
                account={account}
                expandedNodes={expandedNodes}
                onToggleExpand={onToggleExpand}
                onEditAccount={onEditAccount}
                onDeleteAccount={onDeleteAccount}
                onAddAccount={onAddAccount}
                loading={loading}
              />
            ))
          )
        ) : (
          <div className="p-8 text-center text-gray-500">
            No accounts found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default COAAccountTree;