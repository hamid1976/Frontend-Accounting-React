import React, { useState } from 'react';
import { XCircle, CheckCircle, Plus } from 'lucide-react';
 
const CreateInvoiceModal = ({ customers, onClose, onCreate }) => {
  const [form, setForm] = useState({
    customerId: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0, total: 0 }],
    notes: ''
  });
 
  const addItem = () => {
    setForm({ ...form, items: [...form.items, { description: '', quantity: 1, price: 0, total: 0 }] });
  };
 
  const updateItem = (idx, field, value) => {
    const updated = [...form.items];
    updated[idx] = { ...updated[idx], [field]: value };
    if (field === 'quantity' || field === 'price') {
      updated[idx].total = (updated[idx].quantity || 0) * (updated[idx].price || 0);
    }
    setForm({ ...form, items: updated });
  };
 
  const calcTotal = () => form.items.reduce((sum, i) => sum + (i.total || 0), 0);
 
  const handleSubmit = () => {
    if (!form.customerId || !form.dueDate || form.items.length === 0) {
      alert('Please fill all required fields');
      return;
    }
    onCreate({
      ...form,
      amount: calcTotal(),
      paid: 0,
      balance: calcTotal(),
      status: 'outstanding',
      date: new Date().toISOString().substr(0, 10),
      customerName: customers.find(c => c.id === form.customerId)?.name || '',
      items: form.items
    });
    onClose();
  };
 
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Create New Invoice</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={20} />
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
              <select
                value={form.customerId}
                onChange={e => setForm({ ...form, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Customer</option>
                {customers.filter(c => c.customerType !== 'cash').map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          {/* Items */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Items</label>
            <div className="space-y-3">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => updateItem(idx, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                      placeholder="Qty"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={e => updateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="Price"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.total}
                      readOnly
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                    />
                  </div>
                  <div className="col-span-1">
                    {form.items.length > 1 && (
                      <button
                        onClick={() => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3">
              <button
                onClick={addItem}
                className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 flex items-center space-x-1"
              >
                <Plus size={14} />
                <span>Add Item</span>
              </button>
              <div className="text-lg font-semibold">
                Total: ${calcTotal().toFixed(2)}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
            >
              <CheckCircle size={16} />
              <span>Create Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
            >
              <XCircle size={16} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default CreateInvoiceModal;