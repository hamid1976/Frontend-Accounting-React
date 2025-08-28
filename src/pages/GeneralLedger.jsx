import React, { useState, useEffect, useCallback } from 'react';
import { Book } from 'lucide-react';
import { useGeneralLedgerData } from '../components/GeneralLedger/GeneralLedgerHook/useGeneralLedgerData';
import { useJournalEntries } from '../components/GeneralLedger/GeneralLedgerHook/useJournalEntries';
import { useTrialBalance } from '../components/GeneralLedger/GeneralLedgerHook/useTrialBalance';
import GLHeader from '../components/GeneralLedger/GLHeader';
import GLStats from '../components/GeneralLedger/GLStats';
import GLControls from '../components/GeneralLedger/GLControls';
import GLJournalEntryForm from '../components/GeneralLedger/GLJournalEntryForm';
import GLJournalEntriesTable from '../components/GeneralLedger/GLJournalEntriesTable';
import GLIntegrationStatus from '../components/GeneralLedger/GLIntegrationStatus';
import JournalEntryDetailModal from '../modals/JournalEntryDetailModal';
import TrialBalanceModal from '../modals/TrialBalanceModal';

const GeneralLedger = () => {
  // State management
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [showTrialBalance, setShowTrialBalance] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    accountId: '',
    transactionType: 'all',
    searchTerm: ''
  });

  // Custom hooks for data management
  const {
    accounts,
    loading: accountsLoading,
    error: accountsError,
    loadChartsOfAccounts
  } = useGeneralLedgerData();

  const {
    journalEntries,
    filteredEntries,
    newEntry,
    setNewEntry,
    loading: entriesLoading,
    errors,
    loadJournalEntriesFromAPI,
    filterEntries,
    saveJournalEntry,
    getAccountName
  } = useJournalEntries(accounts);

  const {
    trialBalance,
    generateTrialBalance
  } = useTrialBalance(accounts, journalEntries);

  // Load accounts on mount
  useEffect(() => {
    loadChartsOfAccounts();
  }, [loadChartsOfAccounts]);

  // Load journal entries when accounts are loaded
  useEffect(() => {
    if (accounts.length > 0) {
      loadJournalEntriesFromAPI();
    }
  }, [accounts, loadJournalEntriesFromAPI]);

  // Filter entries when filters or journal entries change
  useEffect(() => {
    if (journalEntries.length > 0) {
      filterEntries(filters);
    }
  }, [journalEntries, filters, filterEntries]);

  // Event handlers
  const handleRefresh = () => {
    loadJournalEntriesFromAPI();
  };

  const handleRefreshAccounts = () => {
    loadChartsOfAccounts();
  };

  const handleClearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      accountId: '',
      transactionType: 'all',
      searchTerm: ''
    });
  };

  const handleSaveEntry = () => {
    const success = saveJournalEntry(newEntry);
    if (success) {
      setIsAddingEntry(false);
    }
  };

  const handleGenerateTrialBalance = () => {
    generateTrialBalance();
    setShowTrialBalance(true);
  };

  const loading = {
    accounts: accountsLoading,
    entries: entriesLoading,
    purchase: false // This can be managed separately if needed
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <GLHeader 
        loading={loading}
        errors={{ accounts: accountsError, ...errors }}
      />

      <GLStats journalEntries={journalEntries} />

      <GLControls
        filters={filters}
        setFilters={setFilters}
        accounts={accounts}
        loading={loading}
        onRefresh={handleRefresh}
        onRefreshAccounts={handleRefreshAccounts}
        onClearFilters={handleClearFilters}
        onAddEntry={() => setIsAddingEntry(true)}
        onGenerateTrialBalance={handleGenerateTrialBalance}
      />

      {isAddingEntry && (
        <GLJournalEntryForm
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          accounts={accounts}
          onSave={handleSaveEntry}
          onCancel={() => setIsAddingEntry(false)}
        />
      )}

      <GLJournalEntriesTable
        entries={filteredEntries}
        totalEntries={journalEntries.length}
        onViewEntry={setSelectedEntry}
      />

      {selectedEntry && (
        <JournalEntryDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          getAccountName={getAccountName}
        />
      )}

      {showTrialBalance && (
        <TrialBalanceModal
          trialBalance={trialBalance}
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowTrialBalance(false)}
        />
      )}

      <GLIntegrationStatus />
    </div>
  );
};

export default GeneralLedger;