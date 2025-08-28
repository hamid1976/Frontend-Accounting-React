import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAccounts } from '../ChartsOfAccountsHook/useAccounts';
import { useToast } from '../ChartsOfAccountsHook/useToast';
import COAHeader from '../components/ChartOfAccounts/COAHeader';
import COAControls from '../components/ChartOfAccounts/COAControls';
import COAAccountForm from '../components/ChartOfAccounts/COAAccountForm';
import COAAccountTree from '../components/ChartOfAccounts/COAAccountTree';
import COATypeLegend from '../components/ChartOfAccounts/COATypeLegend';
import COAAPIStatus from '../components/ChartOfAccounts/COAAPIStatus';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import ToastContainer from '../components/common/ToastContainer';
import ErrorMessage from '../components/common/ErrorMessage';
import { accountTypes } from '../ChartsOfAccountUtils/accountConfig';
import { buildHierarchy, flattenAccounts, getFilteredAccounts } from '../ChartsOfAccountUtils/accountHelpers';

const ChartOfAccounts = () => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'assets',
    category: 'account',
    parentId: null,
    description: '',
    active: true
  });

  const { toasts, showToast, removeToast } = useToast();
  const {
    accounts,
    loading,
    error,
    setError,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount
  } = useAccounts(showToast);

  // Initialize component
  useEffect(() => {
    const initializeAccounts = async () => {
      await fetchAccounts();
      // Expand main categories by default after fetching
      if (accounts.length > 0) {
        const mainCategories = accounts
          .filter(account => account.level === 0)
          .map(account => account.id);
        setExpandedNodes(new Set(mainCategories));
      }
    };
    initializeAccounts();
  }, []);

  // Update expanded nodes when accounts change
  useEffect(() => {
    if (accounts.length > 0 && expandedNodes.size === 0) {
      const mainCategories = accounts
        .filter(account => account.level === 0)
        .map(account => account.id);
      setExpandedNodes(new Set(mainCategories));
    }
  }, [accounts]);

  // Toggle expand/collapse
  const toggleExpand = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Handle add account
  const handleAddAccount = (parentId = null) => {
    const flatAccountsList = flattenAccounts(accounts);
    const parentAccount = parentId ? flatAccountsList.find(a => a.id === parentId) : null;
    const accountType = parentAccount ? parentAccount.type : 'assets';
    
    setFormData({
      code: '',
      name: '',
      type: accountType,
      category: 'account',
      parentId,
      description: '',
      active: true
    });
    setIsAddingAccount(true);
  };

  // Handle edit account
  const handleEditAccount = (account) => {
    setFormData({
      code: account.code,
      name: account.name,
      type: account.type,
      category: account.category,
      parentId: account.parentId,
      description: account.description || '',
      active: account.active !== undefined ? account.active : true
    });
    setEditingAccount(account.id);
  };

  // Handle save account
  const handleSaveAccount = async () => {
    if (!formData.name) {
      showToast('Please fill in the account name', 'error');
      return;
    }

    const success = editingAccount 
      ? await updateAccount(editingAccount, formData)
      : await createAccount(formData);

    if (success) {
      // Reset form
      setFormData({
        code: '',
        name: '',
        type: 'assets',
        category: 'account',
        parentId: null,
        description: '',
        active: true
      });
      setIsAddingAccount(false);
      setEditingAccount(null);
    }
  };

  // Handle delete account with confirmation
  const handleDeleteAccount = async (account) => {
    const flatAccountsList = flattenAccounts(accounts);
    const hasChildren = flatAccountsList.some(a => a.parentId === account.id);
    
    if (hasChildren) {
      showToast('Cannot delete account with sub-accounts. Please delete sub-accounts first.', 'error');
      return;
    }

    setConfirmDialog({
      title: 'Delete Account',
      message: `Are you sure you want to delete the account "${account.name}" (${account.code})? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        await deleteAccount(account.id);
        setConfirmDialog(null);
      },
      onCancel: () => {
        setConfirmDialog(null);
      }
    });
  };

  // Handle cancel
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
      active: true
    });
  };

  // Get display data
  const flatAccountsList = flattenAccounts(accounts);
  const filteredAccounts = getFilteredAccounts(flatAccountsList, searchTerm, selectedCategory);
  const displayAccounts = searchTerm || selectedCategory !== 'all' 
    ? filteredAccounts 
    : buildHierarchy(flatAccountsList);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmationDialog
          isOpen={true}
          {...confirmDialog}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <COAHeader />

      {/* Error Message */}
      {error && (
        <ErrorMessage error={error} onClose={() => setError(null)} />
      )}

      {/* Controls */}
      <COAControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onRefresh={fetchAccounts}
        onAddAccount={() => handleAddAccount()}
        loading={loading}
        accountTypes={accountTypes}
      />

      {/* Account Form */}
      {(isAddingAccount || editingAccount) && (
        <COAAccountForm
          formData={formData}
          setFormData={setFormData}
          editingAccount={editingAccount}
          flatAccounts={flatAccountsList}
          onSave={handleSaveAccount}
          onCancel={handleCancel}
          loading={loading}
          accountTypes={accountTypes}
        />
      )}

      {/* Accounts Tree */}
      <COAAccountTree
        accounts={accounts}
        displayAccounts={displayAccounts}
        filteredAccounts={filteredAccounts}
        expandedNodes={expandedNodes}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        loading={loading}
        onToggleExpand={toggleExpand}
        onEditAccount={handleEditAccount}
        onDeleteAccount={handleDeleteAccount}
        onAddAccount={handleAddAccount}
      />

      {/* Account Type Legend */}
      <COATypeLegend accountTypes={accountTypes} />

      {/* API Integration Info */}
      <COAAPIStatus />
    </div>
  );
};

export default ChartOfAccounts;