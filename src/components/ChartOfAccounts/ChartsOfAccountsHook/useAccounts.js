import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';

export const useAccounts = (showToast) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch accounts from API
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAccounts(data);
      return data;
      
    } catch (err) {
      const errorMsg = 'Failed to fetch accounts: ' + err.message;
      setError(errorMsg);
      showToast(errorMsg, 'error');
      console.error('Error fetching accounts:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Create account
  const createAccount = useCallback(async (accountData) => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      showToast(result || 'Account created successfully!', 'success');
      await fetchAccounts(); // Refresh the list
      return true;
    } catch (err) {
      const errorMsg = 'Failed to create account: ' + err.message;
      setError(errorMsg);
      showToast(errorMsg, 'error');
      console.error('Error creating account:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast, fetchAccounts]);

  // Update account
  const updateAccount = useCallback(async (accountId, accountData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${accountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      showToast(result || 'Account updated successfully!', 'success');
      await fetchAccounts(); // Refresh the list
      return true;
    } catch (err) {
      const errorMsg = 'Failed to update account: ' + err.message;
      setError(errorMsg);
      showToast(errorMsg, 'error');
      console.error('Error updating account:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast, fetchAccounts]);

  // Delete account
  const deleteAccount = useCallback(async (accountId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${accountId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      showToast(result || 'Account deleted successfully!', 'success');
      await fetchAccounts(); // Refresh the list
      return true;
    } catch (err) {
      const errorMsg = 'Failed to delete account: ' + err.message;
      setError(errorMsg);
      showToast(errorMsg, 'error');
      console.error('Error deleting account:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast, fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    setError,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount
  };
};