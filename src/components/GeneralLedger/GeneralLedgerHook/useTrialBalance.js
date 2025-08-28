import { useState, useCallback } from 'react';

export const useTrialBalance = (accounts, journalEntries) => {
  const [trialBalance, setTrialBalance] = useState([]);

  const generateTrialBalance = useCallback(() => {
    const balances = {};
    
    accounts.forEach(account => {
      if (account.category === 'account') {
        balances[account.id] = {
          accountId: account.id,
          accountCode: account.code,
          accountName: account.name,
          accountType: account.type || 'unknown',
          debit: 0,
          credit: 0,
          balance: 0
        };
      }
    });
    
    journalEntries.forEach(entry => {
      if (entry.status === 'posted') {
        entry.entries.forEach(entryLine => {
          const accountId = entryLine.accountId;
          if (!balances[accountId]) {
            balances[accountId] = {
              accountId: accountId,
              accountCode: entryLine.accountCode || accountId,
              accountName: entryLine.accountName || `Account ${accountId}`,
              accountType: 'unknown',
              debit: 0,
              credit: 0,
              balance: 0
            };
          }
          
          balances[accountId].debit += parseFloat(entryLine.debit || 0);
          balances[accountId].credit += parseFloat(entryLine.credit || 0);
        });
      }
    });

    Object.values(balances).forEach(account => {
      if (account.accountType === 'assets' || account.accountType === 'expenses') {
        account.balance = account.debit - account.credit;
      } else {
        account.balance = account.credit - account.debit;
      }
    });

    const trialBalanceData = Object.values(balances)
      .filter(account => account.debit > 0 || account.credit > 0)
      .sort((a, b) => a.accountCode.localeCompare(b.accountCode));
    
    setTrialBalance(trialBalanceData);
  }, [accounts, journalEntries]);

  return {
    trialBalance,
    generateTrialBalance
  };
};