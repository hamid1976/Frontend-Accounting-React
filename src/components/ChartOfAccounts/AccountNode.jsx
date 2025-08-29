import React from 'react';
import { ChevronDown, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { accountTypes } from '../ChartOfAccounts/ChartsOfAccountUtils/accountConfig';

const AccountNode = ({
  account,
  expandedNodes,
  onToggleExpand,
  onEditAccount,
  onDeleteAccount,
  onAddAccount,
  loading
}) => {
  const hasChildren = account.children && account.children.length > 0;
  const isExpanded = expandedNodes.has(account.id);
  const typeConfig = accountTypes[account.type];

  return (
    <div className="account-node">
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
            onClick={() => onToggleExpand(account.id)}
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
            {!account.active && <span className="ml-2 text-red-500 text-xs">(Inactive)</span>}
          </span>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
            {typeConfig.label}
          </span>
          
          <div className="flex space-x-1">
            <button
              onClick={() => onEditAccount(account)}
              className="p-1 hover:bg-blue-100 rounded text-blue-600"
              title="Edit Account"
              disabled={loading}
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onDeleteAccount(account)}
              className="p-1 hover:bg-red-100 rounded text-red-600"
              title="Delete Account"
              disabled={loading}
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={() => onAddAccount(account.id)}
              className="p-1 hover:bg-green-100 rounded text-green-600"
              title="Add Sub-Account"
              disabled={loading}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
      
      {account.description && (
        <div className="px-4 py-1 text-sm text-gray-500" style={{ paddingLeft: `${account.level * 20 + 36}px` }}>
          {account.description}
        </div>
      )}

      {isExpanded && hasChildren && (
        <div>
          {account.children.map(child => (
            <AccountNode
              key={child.id}
              account={child}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              onEditAccount={onEditAccount}
              onDeleteAccount={onDeleteAccount}
              onAddAccount={onAddAccount}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountNode;