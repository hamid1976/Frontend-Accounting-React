import React, { useState } from "react";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart2,
  PieChart,
  Calendar,
  Eye,
  XCircle,
  Download,
} from "lucide-react";

// Sample static data for demonstration
const sampleStatements = {
  "profit_loss": {
    id: "PL-2025-Q2",
    title: "Profit & Loss Statement",
    period: "2025 Q2",
    date: "2025-07-10",
    revenue: 95000,
    costOfGoodsSold: 27000,
    grossProfit: 68000,
    operatingExpenses: 22000,
    operatingIncome: 46000,
    netIncome: 39000,
    notes: "Strong sales in Q2 driven by new product launch.",
    details: [
      { name: "Revenue", amount: 95000 },
      { name: "Cost of Goods Sold", amount: -27000 },
      { name: "Gross Profit", amount: 68000 },
      { name: "Operating Expenses", amount: -22000 },
      { name: "Operating Income", amount: 46000 },
      { name: "Taxes", amount: -7000 },
      { name: "Net Income", amount: 39000 },
    ],
  },
  "balance_sheet": {
    id: "BS-2025-Q2",
    title: "Balance Sheet",
    period: "2025 Q2",
    date: "2025-07-10",
    assets: 175000,
    liabilities: 80000,
    equity: 95000,
    notes: "Increase in assets due to equipment purchase.",
    details: [
      { name: "Cash & Equivalents", amount: 33000 },
      { name: "Accounts Receivable", amount: 42000 },
      { name: "Inventory", amount: 25000 },
      { name: "Property, Plant & Equipment", amount: 75000 },
      { name: "Total Assets", amount: 175000, bold: true },
      { name: "Accounts Payable", amount: -26000 },
      { name: "Short-Term Debt", amount: -15000 },
      { name: "Long-Term Debt", amount: -39000 },
      { name: "Total Liabilities", amount: -80000, bold: true },
      { name: "Equity", amount: 95000, bold: true },
    ],
  },
  "cash_flow": {
    id: "CF-2025-Q2",
    title: "Cash Flow Statement",
    period: "2025 Q2",
    date: "2025-07-10",
    cashFromOperations: 41500,
    cashFromInvesting: -10000,
    cashFromFinancing: 3000,
    netChangeInCash: 34500,
    notes: "Positive operational cash flow, minor investments.",
    details: [
      { name: "Cash from Operations", amount: 41500 },
      { name: "Cash from Investing", amount: -10000 },
      { name: "Cash from Financing", amount: 3000 },
      { name: "Net Change in Cash", amount: 34500, bold: true },
    ],
  },
  "retained_earnings": {
    id: "RE-2025-Q2",
    title: "Statement of Retained Earnings",
    period: "2025 Q2",
    date: "2025-07-10",
    beginningRetainedEarnings: 25000,
    netIncome: 39000,
    dividends: -8000,
    endingRetainedEarnings: 56000,
    notes: "Dividends paid to common shareholders.",
    details: [
      { name: "Beginning Retained Earnings", amount: 25000 },
      { name: "Net Income", amount: 39000 },
      { name: "Dividends", amount: -8000 },
      { name: "Ending Retained Earnings", amount: 56000, bold: true },
    ],
  },
};

const statementIcons = {
  "profit_loss": <TrendingUp className="text-green-600" size={20} />,
  "balance_sheet": <BarChart2 className="text-blue-600" size={20} />,
  "cash_flow": <PieChart className="text-emerald-600" size={20} />,
  "retained_earnings": <DollarSign className="text-purple-600" size={20} />,
};

const statementNames = {
  "profit_loss": "Profit & Loss Statement",
  "balance_sheet": "Balance Sheet",
  "cash_flow": "Cash Flow Statement",
  "retained_earnings": "Statement of Retained Earnings",
};

function formatCurrency(amount) {
  const abs = Math.abs(amount);
  return (amount < 0 ? "-$" : "$") + abs.toLocaleString();
}

const StatementViewModal = ({ statement, type, onClose }) => {
  if (!statement) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {statementIcons[type]} {statement.title} ({statement.period})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={20} />
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="mb-3 text-sm text-gray-600 flex items-center gap-2">
            <Calendar size={15} />
            <span>{statement.date}</span>
          </div>
          <div className="mb-5">
            <table className="w-full border border-gray-200 rounded">
              <tbody className="divide-y divide-gray-100">
                {statement.details.map((row, i) => (
                  <tr key={i}>
                    <td
                      className={
                        "px-4 py-2 text-sm text-gray-900" +
                        (row.bold ? " font-bold" : "")
                      }
                    >
                      {row.name}
                    </td>
                    <td
                      className={
                        "px-4 py-2 text-sm text-gray-900 text-right" +
                        (row.bold ? " font-bold" : "")
                      }
                    >
                      {formatCurrency(row.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {statement.notes && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Notes</div>
              <div className="text-sm text-gray-900">{statement.notes}</div>
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

const FinancialStatements = () => {
  const [viewStatement, setViewStatement] = useState(null);
  const [viewType, setViewType] = useState(null);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <FileText className="mr-3 text-emerald-600" />
          Standard Financial Statements
        </h1>
        <p className="text-gray-600">
          View and analyze your core financial statements in real time.
        </p>
      </div>

      {/* Statements Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Profit & Loss */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 flex flex-col">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-600" size={28} />
            <div className="flex-1">
              <div className="text-lg font-semibold text-green-900">
                Profit & Loss Statement
              </div>
              <div className="text-sm text-green-700">
                Income, expenses, and net profit for a given period
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-end">
            <div>
              <div className="text-xs text-green-700">Net Income</div>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(sampleStatements.profit_loss.netIncome)}
              </div>
            </div>
            <button
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              onClick={() => {
                setViewStatement(sampleStatements.profit_loss);
                setViewType("profit_loss");
              }}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
          </div>
        </div>

        {/* Balance Sheet */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 flex flex-col">
          <div className="flex items-center gap-3">
            <BarChart2 className="text-blue-600" size={28} />
            <div className="flex-1">
              <div className="text-lg font-semibold text-blue-900">
                Balance Sheet
              </div>
              <div className="text-sm text-blue-700">
                Assets, liabilities, and equity at a specific point in time
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-end">
            <div>
              <div className="text-xs text-blue-700">Total Assets</div>
              <div className="text-2xl font-bold text-blue-900">
                {formatCurrency(sampleStatements.balance_sheet.assets)}
              </div>
            </div>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              onClick={() => {
                setViewStatement(sampleStatements.balance_sheet);
                setViewType("balance_sheet");
              }}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
          </div>
        </div>

        {/* Cash Flow Statement */}
        <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 flex flex-col">
          <div className="flex items-center gap-3">
            <PieChart className="text-emerald-600" size={28} />
            <div className="flex-1">
              <div className="text-lg font-semibold text-emerald-900">
                Cash Flow Statement
              </div>
              <div className="text-sm text-emerald-700">
                Cash inflows and outflows from operations, investing, and financing
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-end">
            <div>
              <div className="text-xs text-emerald-700">Net Change in Cash</div>
              <div className="text-2xl font-bold text-emerald-900">
                {formatCurrency(sampleStatements.cash_flow.netChangeInCash)}
              </div>
            </div>
            <button
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
              onClick={() => {
                setViewStatement(sampleStatements.cash_flow);
                setViewType("cash_flow");
              }}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
          </div>
        </div>

        {/* Statement of Retained Earnings */}
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 flex flex-col">
          <div className="flex items-center gap-3">
            <DollarSign className="text-purple-600" size={28} />
            <div className="flex-1">
              <div className="text-lg font-semibold text-purple-900">
                Statement of Retained Earnings
              </div>
              <div className="text-sm text-purple-700">
                Changes in retained earnings for the reporting period
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-end">
            <div>
              <div className="text-xs text-purple-700">Ending Retained Earnings</div>
              <div className="text-2xl font-bold text-purple-900">
                {formatCurrency(sampleStatements.retained_earnings.endingRetainedEarnings)}
              </div>
            </div>
            <button
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              onClick={() => {
                setViewStatement(sampleStatements.retained_earnings);
                setViewType("retained_earnings");
              }}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewStatement && (
        <StatementViewModal
          statement={viewStatement}
          type={viewType}
          onClose={() => setViewStatement(null)}
        />
      )}
    </div>
  );
};

export default FinancialStatements;