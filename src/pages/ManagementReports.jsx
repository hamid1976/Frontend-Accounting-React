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


// import React, { useState } from "react";
// import {
//   BarChart2,
//   PieChart,
//   TrendingUp,
//   TrendingDown,
//   Users,
//   Package,
//   DollarSign,
//   Eye,
//   XCircle,
//   Download,
//   Layers,
//   CheckCircle,
//   Calendar,
//   Filter,
//   RefreshCw,
//   FileText,
//   Activity,
//   AlertCircle,
//   Clock,
//   ChevronRight
// } from "lucide-react";

// // Enhanced Sample Data with more realistic metrics
// const sampleReports = {
//   "sales_analysis": {
//     id: "SA-2025-Q2",
//     title: "Sales Analysis by Product/Category",
//     period: "2025 Q2",
//     date: "2025-07-10",
//     lastUpdated: "2025-07-10 14:30:00",
//     summary: "Comprehensive revenue and quantity analysis across product categories with trend indicators.",
//     notes: "Strong performance in medical supplies segment with 15% growth over previous quarter.",
//     chartType: "bar",
//     status: "completed",
//     totalRevenue: 98500,
//     growth: 15.2,
//     details: [
//       { label: "A2A 25MG TAB", category: "Pharmaceuticals", qty: 2100, revenue: 31500, growth: 12.5 },
//       { label: "AALBUMIN 50ML", category: "Pharmaceuticals", qty: 1000, revenue: 25000, growth: 8.3 },
//       { label: "Surgical Gloves", category: "Consumables", qty: 5000, revenue: 15000, growth: 22.1 },
//       { label: "X-Ray Machine", category: "Equipment", qty: 3, revenue: 27000, growth: 5.5 },
//     ],
//     insights: [
//       "Consumables category showing highest growth at 22.1%",
//       "Equipment sales remain stable with consistent demand",
//       "Pharmaceutical products maintain steady performance"
//     ]
//   },
//   "vendor_performance": {
//     id: "VP-2025-Q2",
//     title: "Vendor Performance Report",
//     period: "2025 Q2",
//     date: "2025-07-11",
//     lastUpdated: "2025-07-11 09:15:00",
//     summary: "Comprehensive vendor evaluation based on delivery performance, cost efficiency, and quality metrics.",
//     notes: "MedEquip Distributors achieved highest on-time delivery rate with consistent quality standards.",
//     chartType: "pie",
//     status: "completed",
//     totalVendors: 3,
//     avgDelivery: 3.3,
//     details: [
//       { vendor: "MedEquip Distributors", orders: 15, avgDelivery: 3, cost: 45000, onTime: "98%", rating: 4.8 },
//       { vendor: "Pharma Supplies Ltd.", orders: 10, avgDelivery: 5, cost: 32000, onTime: "90%", rating: 4.2 },
//       { vendor: "General Office Mart", orders: 8, avgDelivery: 2, cost: 9000, onTime: "100%", rating: 4.9 },
//     ],
//     insights: [
//       "General Office Mart maintains perfect on-time delivery",
//       "MedEquip Distributors offers best balance of cost and reliability",
//       "Opportunity to improve Pharma Supplies delivery time"
//     ]
//   },
//   "customer_profitability": {
//     id: "CP-2025-Q2",
//     title: "Customer Profitability Analysis",
//     period: "2025 Q2",
//     date: "2025-07-12",
//     lastUpdated: "2025-07-12 16:45:00",
//     summary: "Detailed profit margin analysis by customer segment with contribution rankings.",
//     notes: "Corporate accounts remain highest contributors with 68% of total profit margin.",
//     chartType: "bar",
//     status: "completed",
//     totalProfit: 40400,
//     profitMargin: 41.0,
//     details: [
//       { customer: "Al Noor Medical Center", revenue: 32500, cost: 18000, profit: 14500, margin: 44.6, segment: "Corporate" },
//       { customer: "Dr. Ahmed Clinic", revenue: 18900, cost: 9000, profit: 9900, margin: 52.4, segment: "Small Business" },
//       { customer: "Pharmacy Plus Chain", revenue: 41000, cost: 25000, profit: 16000, margin: 39.0, segment: "Corporate" },
//     ],
//     insights: [
//       "Small business segment shows highest profit margins",
//       "Corporate accounts provide volume with stable margins",
//       "Opportunity for margin improvement in corporate segment"
//     ]
//   },
//   "cost_center": {
//     id: "CC-2025-Q2",
//     title: "Cost Center Analysis",
//     period: "2025 Q2",
//     date: "2025-07-13",
//     lastUpdated: "2025-07-13 11:20:00",
//     summary: "Department-wise expense analysis with budget variance and efficiency metrics.",
//     notes: "R&D center spent within budget. Administration costs slightly over budget by 5%.",
//     chartType: "pie",
//     status: "completed",
//     totalExpense: 38000,
//     budgetVariance: 2.1,
//     details: [
//       { center: "R&D", expense: 12000, budget: 12500, variance: -4.0, efficiency: "Excellent" },
//       { center: "Sales", expense: 9500, budget: 9000, variance: 5.6, efficiency: "Good" },
//       { center: "Administration", expense: 10500, budget: 10000, variance: 5.0, efficiency: "Fair" },
//       { center: "Logistics", expense: 6000, budget: 6200, variance: -3.2, efficiency: "Excellent" },
//     ],
//     insights: [
//       "R&D and Logistics departments under budget",
//       "Sales department slightly over budget but within acceptable range",
//       "Administration department requires cost optimization review"
//     ]
//   },
// };

// const reportConfigs = {
//   "sales_analysis": {
//     name: "Sales Analysis",
//     icon: Package,
//     color: "green",
//     bgColor: "bg-green-50",
//     borderColor: "border-green-200",
//     textColor: "text-green-900",
//     subtextColor: "text-green-700",
//     buttonColor: "bg-green-600 hover:bg-green-700"
//   },
//   "vendor_performance": {
//     name: "Vendor Performance",
//     icon: Users,
//     color: "blue",
//     bgColor: "bg-blue-50",
//     borderColor: "border-blue-200",
//     textColor: "text-blue-900",
//     subtextColor: "text-blue-700",
//     buttonColor: "bg-blue-600 hover:bg-blue-700"
//   },
//   "customer_profitability": {
//     name: "Customer Profitability",
//     icon: DollarSign,
//     color: "emerald",
//     bgColor: "bg-emerald-50",
//     borderColor: "border-emerald-200",
//     textColor: "text-emerald-900",
//     subtextColor: "text-emerald-700",
//     buttonColor: "bg-emerald-600 hover:bg-emerald-700"
//   },
//   "cost_center": {
//     name: "Cost Center Analysis",
//     icon: Layers,
//     color: "purple",
//     bgColor: "bg-purple-50",
//     borderColor: "border-purple-200",
//     textColor: "text-purple-900",
//     subtextColor: "text-purple-700",
//     buttonColor: "bg-purple-600 hover:bg-purple-700"
//   },
// };

// function formatCurrency(amount) {
//   return "$" + amount.toLocaleString();
// }

// function formatPercentage(value) {
//   return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
// }

// const ReportViewModal = ({ report, type, onClose }) => {
//   if (!report) return null;

//   const config = reportConfigs[type];
//   const IconComponent = config.icon;

//   // Enhanced table rendering based on report type
//   const renderTableContent = () => {
//     switch (type) {
//       case "sales_analysis":
//         return {
//           headers: ["Product", "Category", "Qty Sold", "Revenue", "Growth"],
//           rows: report.details.map((row, idx) => (
//             <tr key={idx} className="hover:bg-gray-50 transition-colors">
//               <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.label}</td>
//               <td className="px-4 py-3 text-sm text-gray-700">
//                 <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
//                   {row.category}
//                 </span>
//               </td>
//               <td className="px-4 py-3 text-sm text-gray-900 text-right">{row.qty.toLocaleString()}</td>
//               <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(row.revenue)}</td>
//               <td className="px-4 py-3 text-sm text-right">
//                 <span className={`flex items-center justify-end ${row.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                   {row.growth >= 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
//                   {formatPercentage(row.growth)}
//                 </span>
//               </td>
//             </tr>
//           ))
//         };

//       case "vendor_performance":
//         return {
//           headers: ["Vendor", "Orders", "Avg. Delivery", "Total Cost", "On-Time %", "Rating"],
//           rows: report.details.map((row, idx) => (
//             <tr key={idx} className="hover:bg-gray-50 transition-colors">
//               <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.vendor}</td>
//               <td className="px-4 py-3 text-sm text-gray-900 text-center">{row.orders}</td>
//               <td className="px-4 py-3 text-sm text-gray-900 text-center">{row.avgDelivery} days</td>
//               <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(row.cost)}</td>
//               <td className="px-4 py-3 text-sm text-center">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   parseFloat(row.onTime) >= 95 ? 'bg-green-100 text-green-800' : 
//                   parseFloat(row.onTime) >= 85 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
//                 }`}>
//                   {row.onTime}
//                 </span>
//               </td>
//               <td className="px-4 py-3 text-sm text-center">
//                 <div className="flex items-center justify-center">
//                   <span className="text-yellow-400 mr-1">★</span>
//                   <span className="font-medium">{row.rating}</span>
//                 </div>
//               </td>
//             </tr>
//           ))
//         };

//       case "customer_profitability":
//         return {
//           headers: ["Customer", "Segment", "Revenue", "Cost", "Profit", "Margin %"],
//           rows: report.details.map((row, idx) => (
//             <tr key={idx} className="hover:bg-gray-50 transition-colors">
//               <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.customer}</td>
//               <td className="px-4 py-3 text-sm">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   row.segment === 'Corporate' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
//                 }`}>
//                   {row.segment}
//                 </span>
//               </td>
//               <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(row.revenue)}</td>
//               <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatCurrency(row.cost)}</td>
//               <td className="px-4 py-3 text-sm font-bold text-green-600 text-right">{formatCurrency(row.profit)}</td>
//               <td className="px-4 py-3 text-sm text-center">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   row.margin >= 45 ? 'bg-green-100 text-green-800' : 
//                   row.margin >= 35 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
//                 }`}>
//                   {row.margin.toFixed(1)}%
//                 </span>
//               </td>
//             </tr>
//           ))
//         };

//       case "cost_center":
//         return {
//           headers: ["Cost Center", "Actual Expense", "Budget", "Variance", "Efficiency"],
//           rows: report.details.map((row, idx) => (
//             <tr key={idx} className="hover:bg-gray-50 transition-colors">
//               <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.center}</td>
//               <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(row.expense)}</td>
//               <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatCurrency(row.budget)}</td>
//               <td className="px-4 py-3 text-sm text-right">
//                 <span className={`flex items-center justify-end ${row.variance <= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                   {row.variance <= 0 ? <TrendingDown size={12} className="mr-1" /> : <TrendingUp size={12} className="mr-1" />}
//                   {formatPercentage(Math.abs(row.variance))}
//                 </span>
//               </td>
//               <td className="px-4 py-3 text-sm text-center">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   row.efficiency === 'Excellent' ? 'bg-green-100 text-green-800' : 
//                   row.efficiency === 'Good' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {row.efficiency}
//                 </span>
//               </td>
//             </tr>
//           ))
//         };

//       default:
//         return { headers: [], rows: [] };
//     }
//   };

//   const { headers, rows } = renderTableContent();

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in fade-in duration-300">
//         {/* Enhanced Header */}
//         <div className={`${config.bgColor} px-6 py-4 border-b border-gray-200`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-white rounded-lg shadow-sm">
//                 <IconComponent className={`text-${config.color}-600`} size={24} />
//               </div>
//               <div>
//                 <h3 className={`text-xl font-bold ${config.textColor}`}>{report.title}</h3>
//                 <div className="flex items-center space-x-4 mt-1">
//                   <span className={`text-sm ${config.subtextColor}`}>{report.period}</span>
//                   <span className="text-xs text-gray-500 flex items-center">
//                     <Clock size={12} className="mr-1" />
//                     Updated: {report.lastUpdated}
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <div className={`px-3 py-1 ${config.bgColor} border ${config.borderColor} rounded-lg`}>
//                 <span className={`text-xs font-medium ${config.textColor}`}>
//                   Status: {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
//                 </span>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <XCircle size={20} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
//           <div className="p-6 space-y-6">
//             {/* Summary Stats */}
//             <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//               {type === "sales_analysis" && (
//                 <>
//                   <div className="bg-gray-50 p-4 rounded-xl">
//                     <div className="text-2xl font-bold text-gray-900">{formatCurrency(report.totalRevenue)}</div>
//                     <div className="text-sm text-gray-600">Total Revenue</div>
//                   </div>
//                   <div className="bg-green-50 p-4 rounded-xl">
//                     <div className="text-2xl font-bold text-green-600 flex items-center">
//                       <TrendingUp size={20} className="mr-1" />
//                       {formatPercentage(report.growth)}
//                     </div>
//                     <div className="text-sm text-green-700">Growth Rate</div>
//                   </div>
//                   <div className="bg-blue-50 p-4 rounded-xl">
//                     <div className="text-2xl font-bold text-blue-600">{report.details.length}</div>
//                     <div className="text-sm text-blue-700">Product Lines</div>
//                   </div>
//                   <div className="bg-purple-50 p-4 rounded-xl">
//                     <div className="text-2xl font-bold text-purple-600">
//                       {new Set(report.details.map(d => d.category)).size}
//                     </div>
//                     <div className="text-sm text-purple-700">Categories</div>
//                   </div>
//                 </>
//               )}
              
//               {type === "customer_profitability" && (
//                 <>
//                   <div className="bg-gray-50 p-4 rounded-xl">
//                     <div className="text-2xl font-bold text-gray-900">{formatCurrency(report.totalProfit)}</div>
//                     <div className="text-sm text-gray-600">Total Profit</div>
//                   </div>
//                   <div className="bg-green-50 p-4 rounded-xl">
//                     <div className="text-2xl font-bold text-green-600">{report.profitMargin.toFixed(1)}%</div>
//                     <div className="text-sm text-green-700">Profit Margin</div>
//                   </div>
//                   <div className="bg-blue-50 p-4 rounded-xl">
//                     <div className="text-2xl font-bold text-blue-600">{report.details.length}</div>
//                     <div className="text-sm text-blue-700">Active Customers</div>
//                   </div>
//                   <div className="bg-purple-50 p-4 rounded-xl">
//                     <div className="text-2xl font-bold text-purple-600">
//                       {new Set(report.details.map(d => d.segment)).size}
//                     </div>
//                     <div className="text-sm text-purple-700">Segments</div>
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Report Description */}
//             <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
//               <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
//                 <FileText size={16} className="mr-2" />
//                 Report Summary
//               </h4>
//               <p className="text-blue-800 text-sm mb-3">{report.summary}</p>
//               {report.notes && (
//                 <div className="mt-3 p-3 bg-blue-100 rounded-lg">
//                   <div className="text-xs font-medium text-blue-900 mb-1">Key Notes:</div>
//                   <div className="text-sm text-blue-800">{report.notes}</div>
//                 </div>
//               )}
//             </div>

//             {/* Data Table */}
//             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//               <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//                 <h4 className="font-semibold text-gray-900 flex items-center">
//                   <Activity size={16} className="mr-2 text-emerald-600" />
//                   Detailed Analysis
//                 </h4>
//               </div>
              
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       {headers.map((header, idx) => (
//                         <th key={idx} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           {header}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {rows}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Key Insights */}
//             {report.insights && (
//               <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
//                 <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
//                   <AlertCircle size={16} className="mr-2" />
//                   Key Insights & Recommendations
//                 </h4>
//                 <ul className="space-y-2">
//                   {report.insights.map((insight, idx) => (
//                     <li key={idx} className="flex items-start text-yellow-800 text-sm">
//                       <ChevronRight size={16} className="mr-2 mt-0.5 flex-shrink-0" />
//                       {insight}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
//               <button className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 ${config.buttonColor} text-white rounded-xl font-medium transition-colors`}>
//                 <Download size={16} />
//                 <span>Export Report</span>
//               </button>
//               <button className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors">
//                 <RefreshCw size={16} />
//                 <span>Refresh Data</span>
//               </button>
//               <button
//                 onClick={onClose}
//                 className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-medium transition-colors"
//               >
//                 <XCircle size={16} />
//                 <span>Close</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ManagementReports = () => {
//   const [viewReport, setViewReport] = useState(null);
//   const [viewType, setViewType] = useState(null);
//   const [selectedPeriod, setSelectedPeriod] = useState("2025 Q2");
//   const [refreshing, setRefreshing] = useState(false);

//   const handleRefreshReports = async () => {
//     setRefreshing(true);
//     // Simulate API call
//     setTimeout(() => setRefreshing(false), 2000);
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white">
//       {/* Enhanced Header */}
//       <div className="mb-8">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//           <div className="mb-4 lg:mb-0">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
//               <BarChart2 className="mr-3 text-blue-600" />
//               Management Reports
//             </h1>
//             <p className="text-gray-600">
//               Comprehensive business intelligence and performance analytics for strategic decision making.
//             </p>
//           </div>
          
//           <div className="flex items-center space-x-3">
//             <div className="flex items-center space-x-2">
//               <Calendar size={16} className="text-gray-400" />
//               <select 
//                 value={selectedPeriod}
//                 onChange={(e) => setSelectedPeriod(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option>2025 Q2</option>
//                 <option>2025 Q1</option>
//                 <option>2024 Q4</option>
//               </select>
//             </div>
            
//             <button 
//               onClick={handleRefreshReports}
//               disabled={refreshing}
//               className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
//             >
//               <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
//               <span>{refreshing ? "Updating..." : "Refresh"}</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Reports Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
//         {Object.entries(reportConfigs).map(([key, config]) => {
//           const report = sampleReports[key];
//           const IconComponent = config.icon;
          
//           return (
//             <div key={key} className={`${config.bgColor} border ${config.borderColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group`}>
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
//                     <IconComponent className={`text-${config.color}-600`} size={28} />
//                   </div>
//                   <div>
//                     <h3 className={`text-lg font-bold ${config.textColor} mb-1`}>
//                       {config.name}
//                     </h3>
//                     <p className={`text-sm ${config.subtextColor} max-w-xs`}>
//                       {report.summary.substring(0, 80)}...
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="text-right">
//                   <div className="text-xs text-gray-500 mb-1">Last Updated</div>
//                   <div className="text-xs font-medium text-gray-700">{report.date}</div>
//                   <div className={`mt-2 px-2 py-1 ${config.bgColor} border ${config.borderColor} rounded-full`}>
//                     <span className={`text-xs font-medium ${config.textColor}`}>
//                       {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Stats Preview */}
//               <div className="mb-4 grid grid-cols-2 gap-3">
//                 {key === "sales_analysis" && (
//                   <>
//                     <div className="text-center p-2 bg-white bg-opacity-50 rounded-lg">
//                       <div className={`text-lg font-bold ${config.textColor}`}>{formatCurrency(report.totalRevenue)}</div>
//                       <div className="text-xs text-gray-600">Revenue</div>
//                     </div>
//                     <div className="text-center p-2 bg-white bg-opacity-50 rounded-lg">
//                       <div className={`text-lg font-bold ${config.textColor} flex items-center justify-center`}>
//                         <TrendingUp size={16} className="mr-1" />
//                         {formatPercentage(report.growth)}
//                       </div>
//                       <div className="text-xs text-gray-600">Growth</div>
//                     </div>
//                   </>
//                 )}
                
//                 {key === "customer_profitability" && (
//                   <>
//                     <div className="text-center p-2 bg-white bg-opacity-50 rounded-lg">
//                       <div className={`text-lg font-bold ${config.textColor}`}>{formatCurrency(report.totalProfit)}</div>
//                       <div className="text-xs text-gray-600">Profit</div>
//                     </div>
//                     <div className="text-center p-2 bg-white bg-opacity-50 rounded-lg">
//                       <div className={`text-lg font-bold ${config.textColor}`}>{report.profitMargin.toFixed(1)}%</div>
//                       <div className="text-xs text-gray-600">Margin</div>
//                     </div>
//                   </>
//                 )}

//                 {key === "vendor_performance" && (
//                   <>
//                     <div className="text-center p-2 bg-white bg-opacity-50 rounded-lg">
//                       <div className={`text-lg font-bold ${config.textColor}`}>{report.totalVendors}</div>
//                       <div className="text-xs text-gray-600">Vendors</div>
//                     </div>
//                     <div className="text-center p-2 bg-white bg-opacity-50 rounded-lg">
//                       <div className={`text-lg font-bold ${config.textColor}`}>{report.avgDelivery.toFixed(1)} days</div>
//                       <div className="text-xs text-gray-600">Avg Delivery</div>
//                     </div>
//                   </>
//                 )}

//                 {key === "cost_center" && (
//                   <>
//                     <div className="text-center p-2 bg-white bg-opacity-50 rounded-lg">
//                       <div className={`text-lg font-bold ${config.textColor}`}>{formatCurrency(report.totalExpense)}</div>
//                       <div className="text-xs text-gray-600">Total Expense</div>
//                     </div>
//                     <div className="text-center p-2 bg-white bg-opacity-50 rounded-lg">
//                       <div className={`text-lg font-bold ${config.textColor} flex items-center justify-center`}>
//                         {report.budgetVariance > 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
//                         {formatPercentage(report.budgetVariance)}
//                       </div>
//                       <div className="text-xs text-gray-600">Budget Variance</div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Action Button */}
//               <div className="flex justify-end">
//                 <button
//                   className={`${config.buttonColor} text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 group-hover:shadow-lg`}
//                   onClick={() => {
//                     setViewReport(report);
//                     setViewType(key);
//                   }}
//                 >
//                   <Eye size={16} />
//                   <span>View Report</span>
//                   <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Quick Insights Dashboard */}
//       <div className="mb-10">
//         <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
//           <Activity className="mr-2 text-emerald-600" />
//           Quick Insights
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
//             <div className="flex items-center justify-between mb-2">
//               <TrendingUp className="text-blue-600" size={20} />
//               <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded-full">+15.2%</span>
//             </div>
//             <div className="text-lg font-bold text-blue-900">{formatCurrency(98500)}</div>
//             <div className="text-sm text-blue-700">Total Sales Revenue</div>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
//             <div className="flex items-center justify-between mb-2">
//               <DollarSign className="text-green-600" size={20} />
//               <span className="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded-full">41.0%</span>
//             </div>
//             <div className="text-lg font-bold text-green-900">{formatCurrency(40400)}</div>
//             <div className="text-sm text-green-700">Net Profit</div>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
//             <div className="flex items-center justify-between mb-2">
//               <Users className="text-purple-600" size={20} />
//               <span className="text-xs font-medium text-purple-700 bg-purple-200 px-2 py-1 rounded-full">94.7%</span>
//             </div>
//             <div className="text-lg font-bold text-purple-900">3.3 days</div>
//             <div className="text-sm text-purple-700">Avg Vendor Delivery</div>
//           </div>

//           <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
//             <div className="flex items-center justify-between mb-2">
//               <Layers className="text-orange-600" size={20} />
//               <span className="text-xs font-medium text-orange-700 bg-orange-200 px-2 py-1 rounded-full">+2.1%</span>
//             </div>
//             <div className="text-lg font-bold text-orange-900">{formatCurrency(38000)}</div>
//             <div className="text-sm text-orange-700">Total Expenses</div>
//           </div>
//         </div>
//       </div>

//       {/* Report View Modal */}
//       {viewReport && (
//         <ReportViewModal
//           report={viewReport}
//           type={viewType}
//           onClose={() => {
//             setViewReport(null);
//             setViewType(null);
//           }}
//         />
//       )}

//       {/* Enhanced Integration Status */}
//       <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-6">
//         <div className="flex items-center mb-4">
//           <div className="p-2 bg-emerald-100 rounded-lg mr-3">
//             <CheckCircle className="text-emerald-600" size={20} />
//           </div>
//           <h3 className="font-bold text-emerald-800">Real-Time Data Integration</h3>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white bg-opacity-70 rounded-xl p-4">
//             <div className="flex items-center mb-2">
//               <Package className="text-emerald-600 mr-2" size={16} />
//               <span className="font-semibold text-emerald-800">Sales & Inventory</span>
//             </div>
//             <p className="text-sm text-emerald-700">
//               Real-time synchronization with inventory and sales systems for instant reporting and analysis
//             </p>
//           </div>
//           <div className="bg-white bg-opacity-70 rounded-xl p-4">
//             <div className="flex items-center mb-2">
//               <Users className="text-blue-600 mr-2" size={16} />
//               <span className="font-semibold text-blue-800">Vendor Analytics</span>
//             </div>
//             <p className="text-sm text-blue-700">
//               Automated vendor performance tracking from accounts payable and procurement modules
//             </p>
//           </div>
//           <div className="bg-white bg-opacity-70 rounded-xl p-4">
//             <div className="flex items-center mb-2">
//               <Layers className="text-purple-600 mr-2" size={16} />
//               <span className="font-semibold text-purple-800">Cost Management</span>
//             </div>
//             <p className="text-sm text-purple-700">
//               Department-wise expense tracking with automated budget variance calculations
//             </p>
//           </div>
//         </div>
        
//         {/* System Status Indicators */}
//         <div className="mt-6 flex flex-wrap gap-4">
//           <div className="flex items-center space-x-2">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span className="text-xs text-gray-600">Data Sync: Active</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//             <span className="text-xs text-gray-600">Reports: Updated</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
//             <span className="text-xs text-gray-600">Analytics: Running</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagementReports;