import { useState, useCallback } from 'react';
import { API_CONFIG } from '../../../utils/apiConfig';
import { flattenAccounts } from '../../../utils/accountHelpers';

export const useGeneralLedgerData = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadChartsOfAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_CONFIG.CHARTS_OF_ACCOUNTS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch accounts: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw accounts data from API:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }
      
      const allAccounts = flattenAccounts(data);
      console.log('All flattened accounts:', allAccounts.length);
      
      const usableAccounts = allAccounts.filter(account => 
        account.category === 'account' && 
        account.id && 
        account.code && 
        account.name && 
        account.type
      );
      
      console.log('Usable accounts (category=account):', usableAccounts.length);
      
      if (usableAccounts.length === 0) {
        console.log('No usable accounts found, using fallback');
        throw new Error('No usable accounts returned from API');
      }
      
      usableAccounts.sort((a, b) => a.code.localeCompare(b.code));
      
      setAccounts(usableAccounts);
      setLoading(false);
      
      console.log(`Successfully loaded ${usableAccounts.length} accounts from API`);
      return usableAccounts;
      
    } catch (error) {
      console.error('Error loading charts of accounts:', error);
      setError(error.message);
      setLoading(false);
      
      console.log('Using fallback chart of accounts');
      setAccounts([]);
      return [];
    }
  }, []);

  return {
    accounts,
    loading,
    error,
    loadChartsOfAccounts
  };
};