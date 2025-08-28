import React from 'react';
import { Filter } from 'lucide-react';

const AccountSelect = ({ value, onChange, accounts, placeholder = "Select Account", showIcon = false }) => {
  return (
    <div className="relative">
      {showIcon && (
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${showIcon ? 'pl-10' : 'px-3'} pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
      >
        <option value="">{placeholder}</option>
        
        {accounts.length > 0 && (
          <>
            {/* Assets */}
            <optgroup label="Assets">
              {accounts
                .filter(acc => acc.type === 'assets' && acc.category === 'account')
                .map(account => (
                  <option key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </option>
                ))}
            </optgroup>
            
            {/* Liabilities */}
            <optgroup label="Liabilities">
              {accounts
                .filter(acc => acc.type === 'liabilities' && acc.category === 'account')
                .map(account => (
                  <option key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </option>
                ))}
            </optgroup>
            
            {/* Equity */}
            <optgroup label="Equity">
              {accounts
                .filter(acc => acc.type === 'equity' && acc.category === 'account')
                .map(account => (
                  <option key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </option>
                ))}
            </optgroup>
            
            {/* Revenue */}
            <optgroup label="Revenue">
              {accounts
                .filter(acc => acc.type === 'revenue' && acc.category === 'account')
                .map(account => (
                  <option key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </option>
                ))}
            </optgroup>
            
            {/* Expenses */}
            <optgroup label="Expenses">
              {accounts
                .filter(acc => acc.type === 'expenses' && acc.category === 'account')
                .map(account => (
                  <option key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </option>
                ))}
            </optgroup>
          </>
        )}
        
        {accounts.length === 0 && (
          <option disabled>Loading accounts...</option>
        )}
      </select>
    </div>
  );
};

export default AccountSelect;