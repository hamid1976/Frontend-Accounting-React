import React from 'react';
import { Plus, Save, X, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import AccountSelect from './AccountSelect';
import { calculateTotals, isBalanced } from './GeneralLedgerUtil/glCalculations';

const GLJournalEntryForm = ({ 
  newEntry, 
  setNewEntry, 
  accounts, 
  onSave, 
  onCancel 
}) => {
  const { totalDebit, totalCredit } = calculateTotals(newEntry.entries);
  const entryIsBalanced = isBalanced(newEntry.entries);

  const addEntryLine = () => {
    setNewEntry({
      ...newEntry,
      entries: [...newEntry.entries, { accountId: '', debit: 0, credit: 0, description: '' }]
    });
  };

  const removeEntryLine = (index) => {
    if (newEntry.entries.length > 2) {
      const updatedEntries = newEntry.entries.filter((_, i) => i !== index);
      setNewEntry({ ...newEntry, entries: updatedEntries });
    }
  };

  const updateEntryLine = (index, field, value) => {
    const updatedEntries = [...newEntry.entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setNewEntry({ ...newEntry, entries: updatedEntries });
  };

  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Add Manual Journal Entry</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            value={newEntry.date}
            onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <input
            type="text"
            value={newEntry.description}
            onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
            placeholder="Enter description"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
          <input
            type="text"
            value={newEntry.reference}
            onChange={(e) => setNewEntry({ ...newEntry, reference: e.target.value })}
            placeholder="Reference number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Entry Lines */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Journal Entry Lines</label>
        <div className="space-y-3">
          {newEntry.entries.map((entry, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded border">
              <div className="col-span-4">
                <AccountSelect
                  value={entry.accountId}
                  onChange={(value) => updateEntryLine(index, 'accountId', value)}
                  accounts={accounts}
                  placeholder="Select Account"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  value={entry.description}
                  onChange={(e) => updateEntryLine(index, 'description', e.target.value)}
                  placeholder="Description"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  step="0.01"
                  value={entry.debit}
                  onChange={(e) => updateEntryLine(index, 'debit', e.target.value)}
                  placeholder="Debit"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  step="0.01"
                  value={entry.credit}
                  onChange={(e) => updateEntryLine(index, 'credit', e.target.value)}
                  placeholder="Credit"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="col-span-1">
                {newEntry.entries.length > 2 && (
                  <button
                    onClick={() => removeEntryLine(index)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-3">
          <button
            onClick={addEntryLine}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center space-x-1"
          >
            <Plus size={14} />
            <span>Add Line</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="font-medium">Total Debit: PKR {totalDebit.toLocaleString('en-PK', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              <span className="mx-2">|</span>
              <span className="font-medium">Total Credit: PKR {totalCredit.toLocaleString('en-PK', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            {entryIsBalanced ? (
              <div className="flex items-center text-green-600">
                <CheckCircle size={16} className="mr-1" />
                <span className="text-sm">Balanced</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <AlertCircle size={16} className="mr-1" />
                <span className="text-sm">Not Balanced</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onSave}
          disabled={!entryIsBalanced}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Save Entry</span>
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
        >
          <X size={16} />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default GLJournalEntryForm;