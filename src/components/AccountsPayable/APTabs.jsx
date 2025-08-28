// src/components/AccountsPayable/APTabs.jsx
import React from 'react';
import { Users, FileText, CheckCircle, Package } from 'lucide-react';

const APTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', name: 'Vendor Overview', icon: Users },
    { id: 'purchase-orders', name: 'Purchase Orders', icon: FileText },
    { id: 'payments', name: 'Payment History', icon: CheckCircle },
    { id: 'products', name: 'Product Catalog', icon: Package }
  ];

  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="mr-2" size={16} />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default APTabs;