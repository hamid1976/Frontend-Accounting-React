import React from 'react';
import { Users, FileText, Clock, CheckCircle } from 'lucide-react';

const APTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', name: 'Customer Overview', icon: Users },
    { id: 'invoices', name: 'Invoices', icon: FileText },
    { id: 'aging', name: 'Aging Report', icon: Clock },
    { id: 'payments', name: 'Payments', icon: CheckCircle }
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
                  ? 'border-emerald-500 text-emerald-600'
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