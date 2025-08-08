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
  TrendingDown,
  Mail,
  Phone
} from 'lucide-react';
import ViewBillModal from '../components/ViewBillModal';

const AccountsPayable = () => {
  const [vendors, setVendors] = useState([]);
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewBill, setViewBill] = useState(null);
 
  const [filters, setFilters] = useState({
    vendorType: 'all',
    status: 'all',
    searchTerm: ''
  });
  const [showBillForm, setShowBillForm] = useState(false);
  const [newBill, setNewBill] = useState({
    vendorId: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0, total: 0 }],
    notes: ''
  });

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // Sample Vendors
    const sampleVendors = [
      {
        id: 'VEND001',
        name: 'MedEquip Distributors',
        email: 'accounts@medequip.com',
        phone: '+966-11-222-3333',
        address: 'Riyadh Industrial City',
        vendorType: 'equipment',
        creditLimit: 100000,
        paymentTerms: 30,
        totalPayable: 28500.00,
        overdueAmount: 5500.00,
        lastPayment: '2025-07-20',
        creditStatus: 'good',
        billCount: 7,
        avgPaymentDays: 28
      },
      {
        id: 'VEND002',
        name: 'Pharma Supplies Ltd.',
        email: 'finance@pharmasupplies.com',
        phone: '+966-12-333-4444',
        address: 'Jeddah, Industrial Area',
        vendorType: 'supplies',
        creditLimit: 50000,
        paymentTerms: 15,
        totalPayable: 12000.00,
        overdueAmount: 2000.00,
        lastPayment: '2025-07-18',
        creditStatus: 'watch',
        billCount: 4,
        avgPaymentDays: 14
      },
      {
        id: 'VEND003',
        name: 'General Office Mart',
        email: 'accounts@officemart.sa',
        phone: '+966-13-666-7777',
        address: 'Al Khobar, Eastern Province',
        vendorType: 'office',
        creditLimit: 25000,
        paymentTerms: 30,
        totalPayable: 4000.00,
        overdueAmount: 0,
        lastPayment: '2025-07-25',
        creditStatus: 'excellent',
        billCount: 2,
        avgPaymentDays: 11
      }
    ];

    // Sample Bills
    const sampleBills = [
      {
        id: 'BILL-2025-001',
        vendorId: 'VEND001',
        vendorName: 'MedEquip Distributors',
        date: '2025-07-10',
        dueDate: '2025-08-09',
        amount: 5500.00,
        paid: 0,
        balance: 5500.00,
        status: 'outstanding',
        daysOverdue: 0,
        paymentTerms: 30,
        items: [
          { description: 'X-Ray Machine Maintenance', quantity: 1, price: 5500.00, total: 5500.00 }
        ],
        notes: 'Annual contract bill',
        source: 'manual',
        poNumber: 'PO-1001'
      },
      {
        id: 'BILL-2025-002',
        vendorId: 'VEND002',
        vendorName: 'Pharma Supplies Ltd.',
        date: '2025-07-01',
        dueDate: '2025-07-16',
        amount: 2000.00,
        paid: 0,
        balance: 2000.00,
        status: 'overdue',
        daysOverdue: 22,
        paymentTerms: 15,
        items: [
          { description: 'Gloves', quantity: 100, price: 10.00, total: 1000.00 },
          { description: 'Face Masks', quantity: 200, price: 5.00, total: 1000.00 }
        ],
        notes: 'Urgent supply order',
        source: 'vendor_app',
        poNumber: 'PO-1002'
      },
      {
        id: 'BILL-2025-003',
        vendorId: 'VEND003',
        vendorName: 'General Office Mart',
        date: '2025-07-23',
        dueDate: '2025-08-22',
        amount: 4000.00,
        paid: 4000.00,
        balance: 0,
        status: 'paid',
        daysOverdue: 0,
        paymentTerms: 30,
        items: [
          { description: 'Office Supplies', quantity: 1, price: 4000.00, total: 4000.00 }
        ],
        notes: 'Monthly supplies',
        source: 'po',
        poNumber: 'PO-1003'
      }
    ];

    // Sample Payments
    const samplePayments = [
      {
        id: 'PAYAP001',
        vendorId: 'VEND003',
        vendorName: 'General Office Mart',
        billId: 'BILL-2025-003',
        date: '2025-07-25',
        amount: 4000.00,
        method: 'bank_transfer',
        reference: 'TXN987654321',
        status: 'cleared',
        notes: 'Payment for July supplies'
      },
      {
        id: 'PAYAP002',
        vendorId: 'VEND001',
        vendorName: 'MedEquip Distributors',
        billId: 'BILL-2025-001',
        date: '2025-07-20',
        amount: 10000.00,
        method: 'check',
        reference: 'CHK-321654',
        status: 'cleared',
        notes: 'Maintenance contract'
      }
    ];

    setVendors(sampleVendors);
    setBills(sampleBills);
    setPayments(samplePayments);
  };

  const getFilteredVendors = () => {
    let filtered = [...vendors];

    if (filters.vendorType !== 'all') {
      filtered = filtered.filter(vendor => vendor.vendorType === filters.vendorType);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(vendor => {
        if (filters.status === 'overdue') return vendor.overdueAmount > 0;
        if (filters.status === 'current') return vendor.totalPayable > 0 && vendor.overdueAmount === 0;
        if (filters.status === 'paid_up') return vendor.totalPayable === 0;
        return true;
      });
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(term) ||
        vendor.email.toLowerCase().includes(term) ||
        vendor.id.toLowerCase().includes(term)
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBillStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'outstanding': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addBillItem = () => {
    setNewBill({
      ...newBill,
      items: [...newBill.items, { description: '', quantity: 1, price: 0, total: 0 }]
    });
  };

  const updateBillItem = (index, field, value) => {
    const updatedItems = [...newBill.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'price') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
    }
    
    setNewBill({ ...newBill, items: updatedItems });
  };

  const calculateBillTotal = () => {
    return newBill.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleCreateBill = () => {
    const vendor = vendors.find(v => v.id === newBill.vendorId);
    if (!vendor) {
      alert('Please select a vendor');
      return;
    }
    const nextId = `BILL-${new Date().getFullYear()}-${String(bills.length + 1).padStart(3, '0')}`;
    const billTotal = calculateBillTotal();

    const newBillData = {
      id: nextId,
      vendorId: vendor.id,
      vendorName: vendor.name,
      date: new Date().toISOString().slice(0, 10),
      dueDate: newBill.dueDate,
      amount: billTotal,
      paid: 0,
      balance: billTotal,
      status: 'outstanding',
      daysOverdue: 0,
      paymentTerms: vendor.paymentTerms,
      items: newBill.items,
      notes: newBill.notes,
      source: 'manual',
      poNumber: '' // Optionally, handle PO number
    };

    setBills(prev => [...prev, newBillData]);

    setVendors(prev =>
      prev.map(v =>
        v.id === vendor.id
          ? {
              ...v,
              totalPayable: v.totalPayable + billTotal,
              billCount: v.billCount + 1
            }
          : v
      )
    );

    setNewBill({
      vendorId: '',
      dueDate: '',
      items: [{ description: '', quantity: 1, price: 0, total: 0 }],
      notes: ''
    });

    setShowBillForm(false);
    alert('Bill created successfully!');
  };

  const filteredVendors = getFilteredVendors();

  // AP Summary
  const totalAP = vendors.reduce((sum, vendor) => sum + vendor.totalPayable, 0);
  const totalOverdue = vendors.reduce((sum, vendor) => sum + vendor.overdueAmount, 0);
  const vendorsWithBalance = vendors.filter(vendor => vendor.totalPayable > 0).length;
  const avgDaysOutstanding = vendors.length
    ? Math.round(vendors.reduce((sum, vendor) => sum + vendor.avgPaymentDays, 0) / vendors.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <CreditCard className="mr-3 text-rose-600" />
          Accounts Payable
        </h1>
        <p className="text-gray-600">Manage vendor bills, payments, and purchase orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total A/P</p>
              <p className="text-2xl font-bold text-blue-900">${totalAP.toFixed(2)}</p>
            </div>
            <DollarSign className="text-blue-600" size={24} />
          </div>
          <p className="text-sm text-blue-700 mt-2">{vendorsWithBalance} vendors with balances</p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Overdue Amount</p>
              <p className="text-2xl font-bold text-red-900">${totalOverdue.toFixed(2)}</p>
            </div>
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <p className="text-sm text-red-700 mt-2">
            {totalAP ? ((totalOverdue / totalAP) * 100).toFixed(1) : 0}% of total A/P
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Avg. Days Outstanding</p>
              <p className="text-2xl font-bold text-green-900">{avgDaysOutstanding}</p>
            </div>
            <Clock className="text-green-600" size={24} />
          </div>
          <p className="text-sm text-green-700 mt-2">Payment performance</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Active Vendors</p>
              <p className="text-2xl font-bold text-purple-900">{vendors.length}</p>
            </div>
            <Users className="text-purple-600" size={24} />
          </div>
          <p className="text-sm text-purple-700 mt-2">Total vendor accounts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Vendor Overview', icon: Users },
              { id: 'bills', name: 'Bills', icon: FileText },
              { id: 'payments', name: 'Payments', icon: CheckCircle }
            ].map((tab) => (
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search vendors..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <select
              value={filters.vendorType}
              onChange={(e) => setFilters({ ...filters, vendorType: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="all">All Vendor Types</option>
              <option value="equipment">Equipment</option>
              <option value="supplies">Supplies</option>
              <option value="office">Office</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="current">Current</option>
              <option value="overdue">Overdue</option>
              <option value="paid_up">Paid Up</option>
            </select>

            <button
              onClick={() => setShowBillForm(true)}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>New Bill</span>
            </button>
          </div>

          {/* Vendor List */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
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
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.id}</div>
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <Mail className="mr-1" size={12} />
                            {vendor.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {vendor.vendorType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${vendor.creditLimit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${vendor.totalPayable.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {vendor.billCount} bills
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {vendor.overdueAmount > 0 ? (
                          <span className="text-red-600 font-medium">
                            ${vendor.overdueAmount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-green-600">$0.00</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCreditStatusColor(vendor.creditStatus)}`}>
                          {vendor.creditStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vendor.lastPayment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="text-rose-600 hover:text-rose-900 mr-3"
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

      {activeTab === 'bills' && (
        <div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Bills</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
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
                  {bills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{bill.id}</div>
                        <div className="text-xs text-gray-500">{bill.source}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{bill.vendorName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bill.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bill.dueDate}
                        {bill.daysOverdue > 0 && (
                          <div className="text-xs text-red-600">
                            {bill.daysOverdue} days overdue
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${bill.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {bill.balance > 0 ? (
                          <span className="text-red-600">${bill.balance.toFixed(2)}</span>
                        ) : (
                          <span className="text-green-600">$0.00</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBillStatusColor(bill.status)}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setViewBill(bill)}
                        className="text-rose-600 hover:text-rose-900 mr-3"
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
            {viewBill && <ViewBillModal bill={viewBill} onClose={() => setViewBill(null)} />}

        </div>
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
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill
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
                        {payment.vendorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.billId}
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

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Vendor Details - {selectedVendor.name}
                </h3>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              {/* Vendor Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vendor ID</label>
                    <p className="text-sm text-gray-900">{selectedVendor.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{selectedVendor.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{selectedVendor.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm text-gray-900">{selectedVendor.address}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vendor Type</label>
                    <p className="text-sm text-gray-900">{selectedVendor.vendorType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Credit Limit</label>
                    <p className="text-sm text-gray-900">${selectedVendor.creditLimit.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                    <p className="text-sm text-gray-900">{selectedVendor.paymentTerms} days</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Credit Status</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCreditStatusColor(selectedVendor.creditStatus)}`}>
                      {selectedVendor.creditStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-600">Current Balance</div>
                  <div className="text-xl font-bold text-blue-900">
                    ${selectedVendor.totalPayable.toFixed(2)}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-red-600">Overdue Amount</div>
                  <div className="text-xl font-bold text-red-900">
                    ${selectedVendor.overdueAmount.toFixed(2)}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-600">Credit Available</div>
                  <div className="text-xl font-bold text-green-900">
                    ${(selectedVendor.creditLimit - selectedVendor.totalPayable).toFixed(2)}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-purple-600">Avg Payment Days</div>
                  <div className="text-xl font-bold text-purple-900">
                    {selectedVendor.avgPaymentDays}
                  </div>
                </div>
              </div>

              {/* Vendor Bills */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Vendor Bills</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Bill</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Due Date</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Balance</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bills
                        .filter(bill => bill.vendorId === selectedVendor.id)
                        .map((bill) => (
                          <tr key={bill.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{bill.id}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{bill.date}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{bill.dueDate}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">${bill.amount.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">${bill.balance.toFixed(2)}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBillStatusColor(bill.status)}`}>
                                {bill.status}
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
                <button className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center space-x-2">
                  <Plus size={16} />
                  <span>New Bill</span>
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

      {/* New Bill Form Modal */}
      {showBillForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Bill</h3>
                <button
                  onClick={() => setShowBillForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              {/* Bill Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
                  <select
                    value={newBill.vendorId}
                    onChange={(e) => setNewBill({ ...newBill, vendorId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map(vendor => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name} ({vendor.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={newBill.dueDate}
                    onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bill Items */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bill Items</label>
                <div className="space-y-3">
                  {newBill.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateBillItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateBillItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          placeholder="Qty"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateBillItem(index, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="Price"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-rose-500"
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
                        {newBill.items.length > 1 && (
                          <button
                            onClick={() => {
                              const updatedItems = newBill.items.filter((_, i) => i !== index);
                              setNewBill({ ...newBill, items: updatedItems });
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
                    onClick={addBillItem}
                    className="px-3 py-1 text-sm bg-rose-100 text-rose-700 rounded hover:bg-rose-200 flex items-center space-x-1"
                  >
                    <Plus size={14} />
                    <span>Add Item</span>
                  </button>

                  <div className="text-lg font-semibold">
                    Total: ${calculateBillTotal().toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newBill.notes}
                  onChange={(e) => setNewBill({ ...newBill, notes: e.target.value })}
                  rows={3}
                  placeholder="Additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleCreateBill}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center space-x-2"
                >
                  <CheckCircle size={16} />
                  <span>Create Bill</span>
                </button>
                <button
                  onClick={() => setShowBillForm(false)}
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
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center mb-4">
          <TrendingDown className="text-blue-600 mr-2" size={20} />
          <h3 className="font-medium text-blue-800">Vendor App Integration Active</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
          <div>
            <strong>Vendor Bills:</strong> Vendor bills are synced automatically from the Vendor app
          </div>
          <div>
            <strong>Payment Scheduling:</strong> Schedule and track payments for all vendor bills
          </div>
          <div>
            <strong>PO Matching:</strong> Automatically match purchase orders with vendor bills
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsPayable;