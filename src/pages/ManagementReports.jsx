import React, { useState } from "react";
import {
  BarChart2,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Eye,
  XCircle,
  Download,
  Layers,
  CheckCircle,
} from "lucide-react";

// Sample Data
const sampleReports = {
  "sales_analysis": {
    id: "SA-2025-Q2",
    title: "Sales Analysis by Product/Category",
    period: "2025 Q2",
    date: "2025-07-10",
    summary: "Revenue and quantities sold by product and category.",
    notes: "Strong performance in medical supplies segment.",
    chartType: "bar",
    details: [
      { label: "A2A 25MG TAB", category: "Pharmaceuticals", qty: 2100, revenue: 31500 },
      { label: "AALBUMIN 50ML", category: "Pharmaceuticals", qty: 1000, revenue: 25000 },
      { label: "Surgical Gloves", category: "Consumables", qty: 5000, revenue: 15000 },
      { label: "X-Ray Machine", category: "Equipment", qty: 3, revenue: 27000 },
    ],
  },
  "vendor_performance": {
    id: "VP-2025-Q2",
    title: "Vendor Performance Report",
    period: "2025 Q2",
    date: "2025-07-11",
    summary: "Evaluates reliability, cost, and delivery time for key vendors.",
    notes: "MedEquip Distributors achieved highest on-time delivery.",
    chartType: "pie",
    details: [
      { vendor: "MedEquip Distributors", orders: 15, avgDelivery: 3, cost: 45000, onTime: "98%" },
      { vendor: "Pharma Supplies Ltd.", orders: 10, avgDelivery: 5, cost: 32000, onTime: "90%" },
      { vendor: "General Office Mart", orders: 8, avgDelivery: 2, cost: 9000, onTime: "100%" },
    ],
  },
  "customer_profitability": {
    id: "CP-2025-Q2",
    title: "Customer Profitability Analysis",
    period: "2025 Q2",
    date: "2025-07-12",
    summary: "Gross profit by customer, ranked by contribution.",
    notes: "Corporate accounts remain highest contributors.",
    chartType: "bar",
    details: [
      { customer: "Al Noor Medical Center", revenue: 32500, cost: 18000, profit: 14500 },
      { customer: "Dr. Ahmed Clinic", revenue: 18900, cost: 9000, profit: 9900 },
      { customer: "Pharmacy Plus Chain", revenue: 41000, cost: 25000, profit: 16000 },
    ],
  },
  "cost_center": {
    id: "CC-2025-Q2",
    title: "Cost Center Reporting",
    period: "2025 Q2",
    date: "2025-07-13",
    summary: "Expense breakdown by department/cost center.",
    notes: "R&D center spent within budget. Admin costs slightly overrun.",
    chartType: "pie",
    details: [
      { center: "R&D", expense: 12000 },
      { center: "Sales", expense: 9500 },
      { center: "Administration", expense: 10500 },
      { center: "Logistics", expense: 6000 },
    ],
  },
};

const reportIcons = {
  "sales_analysis": <Package className="text-green-600" size={20} />,
  "vendor_performance": <Users className="text-blue-600" size={20} />,
  "customer_profitability": <DollarSign className="text-emerald-600" size={20} />,
  "cost_center": <Layers className="text-purple-600" size={20} />,
};

const reportNames = {
  "sales_analysis": "Sales Analysis",
  "vendor_performance": "Vendor Performance",
  "customer_profitability": "Customer Profitability",
  "cost_center": "Cost Center Reporting",
};

function formatCurrency(amount) {
  return "$" + amount.toLocaleString();
}

const ReportViewModal = ({ report, type, onClose }) => {
  if (!report) return null;

  // Table headers and rows per report type
  let headers = [];
  let rows = [];

  if (type === "sales_analysis") {
    headers = ["Product", "Category", "Qty Sold", "Revenue"];
    rows = report.details.map((row, idx) => (
      <tr key={idx}>
        <td className="px-4 py-2 text-sm text-gray-900">{row.label}</td>
        <td className="px-4 py-2 text-sm text-gray-900">{row.category}</td>
        <td className="px-4 py-2 text-sm text-gray-900 text-right">{row.qty}</td>
        <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(row.revenue)}</td>
      </tr>
    ));
  } else if (type === "vendor_performance") {
    headers = ["Vendor", "Orders", "Avg. Delivery (days)", "Cost", "On-Time"];
    rows = report.details.map((row, idx) => (
      <tr key={idx}>
        <td className="px-4 py-2 text-sm text-gray-900">{row.vendor}</td>
        <td className="px-4 py-2 text-sm text-gray-900 text-right">{row.orders}</td>
        <td className="px-4 py-2 text-sm text-gray-900 text-right">{row.avgDelivery}</td>
        <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(row.cost)}</td>
        <td className="px-4 py-2 text-sm text-gray-900 text-right">{row.onTime}</td>
      </tr>
    ));
  } else if (type === "customer_profitability") {
    headers = ["Customer", "Revenue", "Cost", "Profit"];
    rows = report.details.map((row, idx) => (
      <tr key={idx}>
        <td className="px-4 py-2 text-sm text-gray-900">{row.customer}</td>
        <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(row.revenue)}</td>
        <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(row.cost)}</td>
        <td className="px-4 py-2 text-sm text-gray-900 text-right font-bold">{formatCurrency(row.profit)}</td>
      </tr>
    ));
  } else if (type === "cost_center") {
    headers = ["Cost Center", "Expense"];
    rows = report.details.map((row, idx) => (
      <tr key={idx}>
        <td className="px-4 py-2 text-sm text-gray-900">{row.center}</td>
        <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(row.expense)}</td>
      </tr>
    ));
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {reportIcons[type]} {report.title} ({report.period})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={20} />
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="mb-3 text-sm text-gray-600">{report.summary}</div>
          <div className="mb-3 text-xs text-gray-500">
            {report.date}
          </div>
          <div className="overflow-x-auto mb-5">
            <table className="w-full border border-gray-200 rounded">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((h, idx) => (
                    <th key={idx} className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">{rows}</tbody>
            </table>
          </div>
          {report.notes && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Notes</div>
              <div className="text-sm text-gray-900">{report.notes}</div>
            </div>
          )}
          <div className="flex space-x-3 mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Download size={16} />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
            >
              <XCircle size={16} />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagementReports = () => {
  const [viewReport, setViewReport] = useState(null);
  const [viewType, setViewType] = useState(null);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <BarChart2 className="mr-3 text-blue-600" />
          Management Reports
        </h1>
        <p className="text-gray-600">
          Key business performance reports for decision making.
        </p>
      </div>

      {/* Reports Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Sales Analysis */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 flex flex-col">
          <div className="flex items-center gap-3">
            <Package className="text-green-600" size={28} />
            <div className="flex-1">
              <div className="text-lg font-semibold text-green-900">
                Sales Analysis by Product/Category
              </div>
              <div className="text-sm text-green-700">
                Analyze sales by item and category using inventory data
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end items-end">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              onClick={() => {
                setViewReport(sampleReports.sales_analysis);
                setViewType("sales_analysis");
              }}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
          </div>
        </div>

        {/* Vendor Performance */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 flex flex-col">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={28} />
            <div className="flex-1">
              <div className="text-lg font-semibold text-blue-900">
                Vendor Performance Report
              </div>
              <div className="text-sm text-blue-700">
                Track vendor delivery, cost, and reliability
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end items-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              onClick={() => {
                setViewReport(sampleReports.vendor_performance);
                setViewType("vendor_performance");
              }}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
          </div>
        </div>

        {/* Customer Profitability */}
        <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 flex flex-col">
          <div className="flex items-center gap-3">
            <DollarSign className="text-emerald-600" size={28} />
            <div className="flex-1">
              <div className="text-lg font-semibold text-emerald-900">
                Customer Profitability Analysis
              </div>
              <div className="text-sm text-emerald-700">
                Profit contribution by customer
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end items-end">
            <button
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
              onClick={() => {
                setViewReport(sampleReports.customer_profitability);
                setViewType("customer_profitability");
              }}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
          </div>
        </div>

        {/* Cost Center Reporting */}
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 flex flex-col">
          <div className="flex items-center gap-3">
            <Layers className="text-purple-600" size={28} />
            <div className="flex-1">
              <div className="text-lg font-semibold text-purple-900">
                Cost Center Reporting
              </div>
              <div className="text-sm text-purple-700">
                Expenses by department or cost center
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end items-end">
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              onClick={() => {
                setViewReport(sampleReports.cost_center);
                setViewType("cost_center");
              }}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewReport && (
        <ReportViewModal
          report={viewReport}
          type={viewType}
          onClose={() => setViewReport(null)}
        />
      )}

      {/* Integration Status (optional for consistency) */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center mb-4">
          <CheckCircle className="text-blue-600 mr-2" size={20} />
          <h3 className="font-medium text-blue-800">Data Integration Active</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
          <div>
            <strong>Sales & Inventory:</strong> Real-time sync with inventory and sales for instant reporting
          </div>
          <div>
            <strong>Vendor Data:</strong> Vendor metrics from AP and purchasing modules
          </div>
          <div>
            <strong>Cost Centers:</strong> Expenses tracked per department for accurate reporting
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementReports;