import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Download,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  TrendingUp,
  Mail,
  Phone
} from 'lucide-react';
import CreateInvoiceModal from '../components/CreateInvoiceModal';
import InvoiceModal from '../components/InvoiceModal';

const AccountsReceivable = () => {
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewInvoice, setViewInvoice] = useState(null);
 
  const [filters, setFilters] = useState({
    customerType: 'all',
    status: 'all',
    dateRange: '30',
    searchTerm: ''
  });
  const handleCreateInvoice = () => {
  // Find the customer name for the invoice
  const customer = customers.find(c => c.id === newInvoice.customerId);
  if (!customer) {
    alert('Please select a customer');
    return;
  }
  // Generate a new invoice ID (simple example)
  const nextId = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
  const invoiceTotal = calculateInvoiceTotal();
 
  const newInvoiceData = {
    id: nextId,
    customerId: customer.id,
    customerName: customer.name,
    date: new Date().toISOString().slice(0, 10),
    dueDate: newInvoice.dueDate,
    amount: invoiceTotal,
    paid: 0,
    balance: invoiceTotal,
    status: 'outstanding',
    daysOverdue: 0,
    paymentTerms: customer.paymentTerms,
    items: newInvoice.items,
    notes: newInvoice.notes,
    source: 'manual'
  };
 
  // Append to invoices
  setInvoices(prev => [...prev, newInvoiceData]);
 
  // Optionally update customer AR data (totalOwed, invoiceCount, etc.)
  setCustomers(prev =>
    prev.map(c =>
      c.id === customer.id
        ? {
            ...c,
            totalOwed: c.totalOwed + invoiceTotal,
            invoiceCount: c.invoiceCount + 1
          }
        : c
    )
  );
 
  // Reset the form
  setNewInvoice({
    customerId: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0, total: 0 }],
    notes: ''
  });
 
  setShowInvoiceForm(false);
  alert('Invoice created successfully!');
};
 
  // const handleCreateInvoice = (invoice) => {
  //   setInvoices(prev => [
  //     {
  //       ...invoice,
  //       id: `INV-${new Date().getFullYear()}-${String(prev.length + 1).padStart(3, '0')}`
  //     },
  //     ...prev
  //   ]);
  // };
 
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customerId: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0, total: 0 }],
    notes: ''
  });

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // Sample Customers with AR data
    const sampleCustomers = [
      {
        id: 'CUST001',
        name: 'Al Noor Medical Center',
        email: 'finance@alnoor.com',
        phone: '+966-11-123-4567',
        address: 'King Fahd Road, Riyadh',
        customerType: 'corporate',
        creditLimit: 50000,
        paymentTerms: 30,
        totalOwed: 15750.00,
        overdueAmount: 5250.00,
        lastPayment: '2025-01-10',
        creditStatus: 'good',
        accountBalance: -15750.00,
        invoiceCount: 8,
        avgPaymentDays: 25
      },
      {
        id: 'CUST002',
        name: 'Dr. Ahmed Clinic',
        email: 'dr.ahmed@clinic.com',
        phone: '+966-12-987-6543',
        address: 'Prince Sultan Street, Jeddah',
        customerType: 'small_business',
        creditLimit: 20000,
        paymentTerms: 15,
        totalOwed: 8900.00,
        overdueAmount: 2100.00,
        lastPayment: '2025-01-12',
        creditStatus: 'watch',
        accountBalance: -8900.00,
        invoiceCount: 5,
        avgPaymentDays: 18
      },
      {
        id: 'CUST003',
        name: 'Pharmacy Plus Chain',
        email: 'accounts@pharmacyplus.sa',
        phone: '+966-13-555-0123',
        address: 'Al Khobar, Eastern Province',
        customerType: 'corporate',
        creditLimit: 75000,
        paymentTerms: 45,
        totalOwed: 32100.00,
        overdueAmount: 0,
        lastPayment: '2025-01-14',
        creditStatus: 'excellent',
        accountBalance: -32100.00,
        invoiceCount: 12,
        avgPaymentDays: 35
      },
      {
        id: 'CUST004',
        name: 'Walk-in Customer',
        email: 'cash@pos.system',
        phone: '+966-50-000-0000',
        address: 'Point of Sale',
        customerType: 'cash',
        creditLimit: 0,
        paymentTerms: 0,
        totalOwed: 0,
        overdueAmount: 0,
        lastPayment: '2025-01-15',
        creditStatus: 'cash_only',
        accountBalance: 0,
        invoiceCount: 0,
        avgPaymentDays: 0
      }
    ];

    // Sample Invoices
    const sampleInvoices = [
      {
        id: 'INV-2025-001',
        customerId: 'CUST001',
        customerName: 'Al Noor Medical Center',
        date: '2025-01-15',
        dueDate: '2025-02-14',
        amount: 5250.00,
        paid: 0,
        balance: 5250.00,
        status: 'outstanding',
        daysOverdue: 0,
        paymentTerms: 30,
        items: [
          { description: 'A2A 25MG TAB', quantity: 100, price: 15.00, total: 1500.00 },
          { description: 'AALBUMIN 50ML', quantity: 150, price: 25.00, total: 3750.00 }
        ],
        notes: 'Monthly medical supplies order',
        source: 'manual'
      },
      {
        id: 'INV-2025-002',
        customerId: 'CUST002',
        customerName: 'Dr. Ahmed Clinic',
        date: '2025-01-10',
        dueDate: '2025-01-25',
        amount: 2100.00,
        paid: 0,
        balance: 2100.00,
        status: 'overdue',
        daysOverdue: 5,
        paymentTerms: 15,
        items: [
          { description: 'ABAKTAL INJ', quantity: 50, price: 30.00, total: 1500.00 },
          { description: 'AARAM PLUS', quantity: 20, price: 30.00, total: 600.00 }
        ],
        notes: 'Urgent medical supplies',
        source: 'pos'
      },
      {
        id: 'POS-2025-003',
        customerId: 'CUST001',
        customerName: 'Al Noor Medical Center',
        date: '2025-01-12',
        dueDate: '2025-02-11',
        amount: 1850.00,
        paid: 1850.00,
        balance: 0,
        status: 'paid',
        daysOverdue: 0,
        paymentTerms: 30,
        items: [
          { description: 'Medical supplies - POS Sale', quantity: 1, price: 1850.00, total: 1850.00 }
        ],
        notes: 'Direct POS sale - Credit account',
        source: 'pos'
      }
    ];

    // Sample Payments
    const samplePayments = [
      {
        id: 'PAY001',
        customerId: 'CUST001',
        customerName: 'Al Noor Medical Center',
        invoiceId: 'POS-2025-003',
        date: '2025-01-14',
        amount: 1850.00,
        method: 'bank_transfer',
        reference: 'TXN123456789',
        status: 'cleared',
        notes: 'Payment for POS sale'
      },
      {
        id: 'PAY002',
        customerId: 'CUST003',
        customerName: 'Pharmacy Plus Chain',
        invoiceId: 'INV-2024-045',
        date: '2025-01-12',
        amount: 15600.00,
        method: 'check',
        reference: 'CHK-789123',
        status: 'cleared',
        notes: 'December invoice payment'
      }
    ];

    setCustomers(sampleCustomers);
    setInvoices(sampleInvoices);
    setPayments(samplePayments);
  };

  const calculateARSummary = () => {
    const totalAR = customers.reduce((sum, customer) => sum + customer.totalOwed, 0);
    const totalOverdue = customers.reduce((sum, customer) => sum + customer.overdueAmount, 0);
    const customersWithBalance = customers.filter(customer => customer.totalOwed > 0).length;
    const avgDaysOutstanding = customers.reduce((sum, customer) => sum + customer.avgPaymentDays, 0) / customers.length;

    return {
      totalAR,
      totalOverdue,
      customersWithBalance,
      avgDaysOutstanding: Math.round(avgDaysOutstanding)
    };
  };

  const getAgingData = () => {
    const aging = {
      current: 0,
      days30: 0,
      days60: 0,
      days90: 0,
      over90: 0
    };

    invoices.forEach(invoice => {
      if (invoice.status === 'paid') return;
      
      const daysPastDue = invoice.daysOverdue || 0;
      
      if (daysPastDue <= 0) {
        aging.current += invoice.balance;
      } else if (daysPastDue <= 30) {
        aging.days30 += invoice.balance;
      } else if (daysPastDue <= 60) {
        aging.days60 += invoice.balance;
      } else if (daysPastDue <= 90) {
        aging.days90 += invoice.balance;
      } else {
        aging.over90 += invoice.balance;
      }
    });

    return aging;
  };

  const getFilteredCustomers = () => {
    let filtered = [...customers];

    if (filters.customerType !== 'all') {
      filtered = filtered.filter(customer => customer.customerType === filters.customerType);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(customer => {
        if (filters.status === 'overdue') return customer.overdueAmount > 0;
        if (filters.status === 'current') return customer.totalOwed > 0 && customer.overdueAmount === 0;
        if (filters.status === 'paid_up') return customer.totalOwed === 0;
        return true;
      });
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.id.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const getCreditStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'watch': return 'bg-yellow-100 text-yellow-800';
      case 'hold': return 'bg-red-100 text-red-800';
      case 'cash_only': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'outstanding': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addInvoiceItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: '', quantity: 1, price: 0, total: 0 }]
    });
  };

  const updateInvoiceItem = (index, field, value) => {
    const updatedItems = [...newInvoice.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'price') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
    }
    
    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  const calculateInvoiceTotal = () => {
    return newInvoice.items.reduce((sum, item) => sum + item.total, 0);
  };

  const summary = calculateARSummary();
  const aging = getAgingData();
  const filteredCustomers = getFilteredCustomers();

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <CreditCard className="mr-3 text-emerald-600" />
          Accounts Receivable
        </h1>
        <p className="text-gray-600">Manage customer invoicing, payments, and credit limits</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total A/R</p>
              <p className="text-2xl font-bold text-blue-900">${summary.totalAR.toFixed(2)}</p>
            </div>
            <DollarSign className="text-blue-600" size={24} />
          </div>
          <p className="text-sm text-blue-700 mt-2">{summary.customersWithBalance} customers with balances</p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Overdue Amount</p>
              <p className="text-2xl font-bold text-red-900">${summary.totalOverdue.toFixed(2)}</p>
            </div>
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <p className="text-sm text-red-700 mt-2">
            {((summary.totalOverdue / summary.totalAR) * 100).toFixed(1)}% of total A/R
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Avg. Days Outstanding</p>
              <p className="text-2xl font-bold text-green-900">{summary.avgDaysOutstanding}</p>
            </div>
            <Clock className="text-green-600" size={24} />
          </div>
          <p className="text-sm text-green-700 mt-2">Collection performance</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Active Customers</p>
              <p className="text-2xl font-bold text-purple-900">{customers.length}</p>
            </div>
            <Users className="text-purple-600" size={24} />
          </div>
          <p className="text-sm text-purple-700 mt-2">Total customer accounts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Customer Overview', icon: Users },
              { id: 'invoices', name: 'Invoices', icon: FileText },
              { id: 'aging', name: 'Aging Report', icon: Clock },
              { id: 'payments', name: 'Payments', icon: CheckCircle }
            ].map((tab) => (
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search customers..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <select
              value={filters.customerType}
              onChange={(e) => setFilters({ ...filters, customerType: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Customer Types</option>
              <option value="corporate">Corporate</option>
              <option value="small_business">Small Business</option>
              <option value="individual">Individual</option>
              <option value="cash">Cash Only</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="current">Current</option>
              <option value="overdue">Overdue</option>
              <option value="paid_up">Paid Up</option>
            </select>

            <button
              onClick={() => setShowInvoiceForm(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>New Invoice</span>
            </button>
          </div>

          {/* Customer List */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit Limit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overdue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.id}</div>
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <Mail className="mr-1" size={12} />
                            {customer.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {customer.customerType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${customer.creditLimit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${customer.totalOwed.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {customer.invoiceCount} invoices
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.overdueAmount > 0 ? (
                          <span className="text-red-600 font-medium">
                            ${customer.overdueAmount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-green-600">$0.00</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCreditStatusColor(customer.creditStatus)}`}>
                          {customer.creditStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.lastPayment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-emerald-600 hover:text-emerald-900 mr-3"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'aging' && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Aging Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aging Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="font-medium text-green-800">Current (0-30 days)</span>
                  <span className="font-bold text-green-900">${aging.current.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                  <span className="font-medium text-yellow-800">31-60 days</span>
                  <span className="font-bold text-yellow-900">${aging.days30.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                  <span className="font-medium text-orange-800">61-90 days</span>
                  <span className="font-bold text-orange-900">${aging.days60.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span className="font-medium text-red-800">Over 90 days</span>
                  <span className="font-bold text-red-900">${aging.over90.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Outstanding</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${(aging.current + aging.days30 + aging.days60 + aging.days90 + aging.over90).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Collection Priority */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Priority</h3>
              <div className="space-y-3">
                {customers
                  .filter(customer => customer.overdueAmount > 0)
                  .sort((a, b) => b.overdueAmount - a.overdueAmount)
                  .slice(0, 5)
                  .map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">
                          Last payment: {customer.lastPayment}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-900">${customer.overdueAmount.toFixed(2)}</div>
                        <div className="text-xs text-red-700">#{index + 1} Priority</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                        <div className="text-xs text-gray-500">{invoice.source}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{invoice.customerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.dueDate}
                        {invoice.daysOverdue > 0 && (
                          <div className="text-xs text-red-600">
                            {invoice.daysOverdue} days overdue
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {invoice.balance > 0 ? (
                          <span className="text-red-600">${invoice.balance.toFixed(2)}</span>
                        ) : (
                          <span className="text-green-600">$0.00</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInvoiceStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                              className="text-emerald-600 hover:text-emerald-900 mr-3"
                              onClick={() => setViewInvoice(invoice)}
                            >
                              <Eye size={16} />
                            </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* View Invoice Modal */}
          <InvoiceModal
            invoice={viewInvoice}
            onClose={() => setViewInvoice(null)}
          />
        </div>
      )}
 
      {/* Create Invoice Modal */}
      {showInvoiceForm && (
        <CreateInvoiceModal
          customers={customers}
          onClose={() => setShowInvoiceForm(false)}
          onCreate={handleCreateInvoice}
        />
        
      )}

      {activeTab === 'payments' && (
        <div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.invoiceId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {payment.method.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          payment.status === 'cleared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Customer Details - {selectedCustomer.name}
                </h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              {/* Customer Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer ID</label>
                    <p className="text-sm text-gray-900">{selectedCustomer.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm text-gray-900">{selectedCustomer.address}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer Type</label>
                    <p className="text-sm text-gray-900">{selectedCustomer.customerType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Credit Limit</label>
                    <p className="text-sm text-gray-900">${selectedCustomer.creditLimit.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                    <p className="text-sm text-gray-900">{selectedCustomer.paymentTerms} days</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Credit Status</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCreditStatusColor(selectedCustomer.creditStatus)}`}>
                      {selectedCustomer.creditStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-600">Current Balance</div>
                  <div className="text-xl font-bold text-blue-900">
                    ${selectedCustomer.totalOwed.toFixed(2)}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-red-600">Overdue Amount</div>
                  <div className="text-xl font-bold text-red-900">
                    ${selectedCustomer.overdueAmount.toFixed(2)}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-600">Credit Available</div>
                  <div className="text-xl font-bold text-green-900">
                    ${(selectedCustomer.creditLimit - selectedCustomer.totalOwed).toFixed(2)}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-purple-600">Avg Payment Days</div>
                  <div className="text-xl font-bold text-purple-900">
                    {selectedCustomer.avgPaymentDays}
                  </div>
                </div>
              </div>

              {/* Customer Invoices */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Customer Invoices</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Invoice</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Due Date</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Balance</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invoices
                        .filter(inv => inv.customerId === selectedCustomer.id)
                        .map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{invoice.id}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{invoice.date}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{invoice.dueDate}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">${invoice.amount.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">${invoice.balance.toFixed(2)}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInvoiceStatusColor(invoice.status)}`}>
                                {invoice.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2">
                  <Plus size={16} />
                  <span>New Invoice</span>
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <CheckCircle size={16} />
                  <span>Record Payment</span>
                </button>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center space-x-2">
                  <Mail size={16} />
                  <span>Send Statement</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Invoice Form */}
      {showInvoiceForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Invoice</h3>
                <button
                  onClick={() => setShowInvoiceForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              {/* Invoice Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                  <select
                    value={newInvoice.customerId}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Items</label>
                <div className="space-y-3">
                  {newInvoice.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          placeholder="Qty"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateInvoiceItem(index, 'price', parseFloat(e.target.value) || 0)}
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
                        {newInvoice.items.length > 1 && (
                          <button
                            onClick={() => {
                              const updatedItems = newInvoice.items.filter((_, i) => i !== index);
                              setNewInvoice({ ...newInvoice, items: updatedItems });
                            }}
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
                    onClick={addInvoiceItem}
                    className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 flex items-center space-x-1"
                  >
                    <Plus size={14} />
                    <span>Add Item</span>
                  </button>

                  <div className="text-lg font-semibold">
                    Total: ${calculateInvoiceTotal().toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newInvoice.notes}
                  onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                  rows={3}
                  placeholder="Additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleCreateInvoice()
 
                    // Save invoice logic would go here
                    alert('Invoice created successfully!');
                  //  setShowInvoiceForm(false);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
                >
                  <CheckCircle size={16} />
                  <span>Create Invoice</span>
                </button>
                <button
                  onClick={() => setShowInvoiceForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
                >
                  <XCircle size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Status */}
      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center mb-4">
          <CheckCircle className="text-green-600 mr-2" size={20} />
          <h3 className="font-medium text-green-800">POS Integration Active</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
          <div>
            <strong>Credit Sales:</strong> Automatically create AR entries when customers buy on credit in POS
          </div>
          <div>
            <strong>Customer Limits:</strong> POS checks credit limits before allowing credit sales
          </div>
          <div>
            <strong>Real-time Updates:</strong> Customer balances update instantly with each transaction
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsReceivable;