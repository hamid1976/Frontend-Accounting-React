import React, { useState } from "react";
import {
  FileText,
  Percent,
  CheckCircle,
  Download,
  Eye,
  XCircle,
  TrendingUp,
  Layers,
  Plus,
} from "lucide-react";

// Sample static data for demonstration
const sampleReports = {
  vat_report: {
    id: "VAT-2025-Q2",
    title: "VAT/Sales Tax Report",
    period: "2025 Q2",
    date: "2025-07-14",
    summary: "Summary of VAT collected and paid on all taxable transactions.",
    notes: "Ensure all POS sales are synced before filing.",
    totalSales: 150000,
    taxableSales: 120000,
    vatCollected: 18000,
    purchases: 60000,
    vatPaid: 9000,
    netVAT: 9000,
    details: [
      { label: "Total Sales", value: 150000 },
      { label: "Taxable Sales", value: 120000 },
      { label: "VAT Collected", value: 18000 },
      { label: "Purchases", value: 60000 },
      { label: "VAT Paid on Purchases", value: 9000 },
      { label: "Net VAT Payable", value: 9000, bold: true },
    ],
  },
  zatca: {
    id: "ZATCA-2025-Q2",
    title: "ZATCA Compliance Report",
    period: "2025 Q2",
    date: "2025-07-15",
    summary: "ZATCA e-invoicing compliance and validation summary.",
    notes: "No compliance violations detected.",
    invoicesIssued: 1100,
    compliant: 1100,
    nonCompliant: 0,
    details: [
      { label: "Invoices Issued", value: 1100 },
      { label: "Compliant Invoices", value: 1100 },
      { label: "Non-Compliant Invoices", value: 0, danger: true },
      { label: "Compliance Rate", value: "100%", bold: true },
    ],
  },
  tax_filing: {
    id: "TF-2025-Q2",
    title: "Tax Filing Preparation Report",
    period: "2025 Q2",
    date: "2025-07-16",
    summary: "Aggregated data for quarterly tax filing.",
    notes: "Export as CSV for upload to tax authority.",
    documents: 3,
    totalAmount: 9000,
    status: "Ready",
    details: [
      { label: "VAT Report", value: "Ready" },
      { label: "ZATCA Report", value: "Ready" },
      { label: "POS Sales Summary", value: "Ready" },
      { label: "Total Tax to File", value: 9000, bold: true },
    ],
  },
  auto_posting: {
    id: "AP-2025-Q2",
    title: "Automated Tax Posting",
    period: "2025 Q2",
    date: "2025-07-17",
    summary: "Automated posting of VAT from POS transactions.",
    notes: "All POS transactions mapped and posted.",
    posTransactions: 3450,
    vatPosted: 18000,
    details: [
      { label: "POS Transactions", value: 3450 },
      { label: "VAT Posted", value: 18000, bold: true },
    ],
  },
};

const reportIcons = {
  vat_report: <Percent className="text-green-700" size={20} />,
  zatca: <Layers className="text-blue-600" size={20} />,
  tax_filing: <FileText className="text-emerald-600" size={20} />,
  auto_posting: <CheckCircle className="text-purple-600" size={20} />,
};

function formatCurrency(amount) {
  if (typeof amount === "string") return amount;
  return "SAR " + amount.toLocaleString();
}

const TaxReportViewModal = ({ report, type, onClose }) => {
  if (!report) return null;

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
          <div className="mb-2 text-sm text-gray-600">{report.summary}</div>
          <div className="mb-3 text-xs text-gray-500">{report.date}</div>
          <div className="mb-5">
            <table className="w-full border border-gray-200 rounded">
              <tbody className="divide-y divide-gray-100">
                {report.details.map((row, i) => (
                  <tr key={i}>
                    <td
                      className={
                        "px-4 py-2 text-sm text-gray-900" +
                        (row.bold ? " font-bold" : "") +
                        (row.danger ? " text-red-600" : "")
                      }
                    >
                      {row.label}
                    </td>
                    <td
                      className={
                        "px-4 py-2 text-sm text-gray-900 text-right" +
                        (row.bold ? " font-bold" : "") +
                        (row.danger ? " text-red-600" : "")
                      }
                    >
                      {formatCurrency(row.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
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

const TaxReporting = () => {
  const [viewReport, setViewReport] = useState(null);
  const [viewType, setViewType] = useState(null);

  // Example: "Create" functionality for a new VAT report
  const [showVatForm, setShowVatForm] = useState(false);
  const [vatForm, setVatForm] = useState({
    totalSales: "",
    taxableSales: "",
    purchases: "",
    vatRate: "0.15",
  });

  const handleVatFormSubmit = e => {
    e.preventDefault();
    // Basic calculation demo
    const vatCollected = +vatForm.taxableSales * +vatForm.vatRate;
    const vatPaid = +vatForm.purchases * +vatForm.vatRate;
    const netVAT = vatCollected - vatPaid;
    alert(
      `VAT Calculated!\nVAT Collected: SAR ${vatCollected.toFixed(
        2
      )}\nVAT Paid: SAR ${vatPaid.toFixed(
        2
      )}\nNet VAT Payable: SAR ${netVAT.toFixed(2)}`
    );
    setShowVatForm(false);
    setVatForm({
      totalSales: "",
      taxableSales: "",
      purchases: "",
      vatRate: "0.15",
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Percent className="mr-3 text-green-700" />
          Tax Reporting
        </h1>
        <p className="text-gray-600">
          Automated compliance, tax calculation, and reporting for VAT, ZATCA, and tax filing.
        </p>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* VAT/Sales Tax Report */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 flex flex-col">
          <div className="flex items-center gap-3">
            <Percent className="text-green-700" size={28} />
            <div className="flex-1">
              <div className="text-lg font-semibold text-green-900">
                VAT/Sales Tax Calculations &amp; Reports
              </div>
              <div className="text-sm text-green-700">
                Calculate and summarize VAT or sales tax for all sales and purchases.
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-end">
            <button
              className="mr-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              onClick={() => {
                setViewReport(sampleReports.vat_report);
                setViewType("vat_report");
              }}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
            <button
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 flex items-center space-x-1"
              onClick={() => setShowVatForm(true)}
            >
              <Plus size={14} />
              <span>Calculate</span>
            </button>
          </div>
        </div>

        {/* ZATCA Compliance */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 flex flex-col">
          <div className="flex items-center gap-3">
            <Layers className="text-blue-600" size={28} />
            <div className="flex-1">
              <div className="text-lg font-semibold text-blue-900">
                ZATCA Compliance Integration
              </div>
              <div className="text-sm text-blue-700">
                Ensure e-invoice compliance with ZATCA requirements.
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end items-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              onClick={() => {
                setViewReport(sampleReports.zatca);
                setViewType("zatca");
              }}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
          </div>
        </div>

        {/* Tax Filing Preparation */}
        <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 flex flex-col">
          <div className="flex items-center gap-3">
            <FileText className="text-emerald-600" size={28} />
            <div className="flex-1">
              <div className="text-lg font-semibold text-emerald-900">
                Tax Filing Preparation
              </div>
              <div className="text-sm text-emerald-700">
                Prepare and export tax data for authority filing.
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end items-end">
            <button
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
              onClick={() => {
                setViewReport(sampleReports.tax_filing);
                setViewType("tax_filing");
              }}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
          </div>
        </div>

        {/* Automated Tax Posting */}
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 flex flex-col">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-purple-600" size={28} />
            <div className="flex-1">
              <div className="text-lg font-semibold text-purple-900">
                Automated Tax Posting from POS
              </div>
              <div className="text-sm text-purple-700">
                VAT auto-posted from POS sales for compliance and audit.
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end items-end">
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              onClick={() => {
                setViewReport(sampleReports.auto_posting);
                setViewType("auto_posting");
              }}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewReport && (
        <TaxReportViewModal
          report={viewReport}
          type={viewType}
          onClose={() => setViewReport(null)}
        />
      )}

      {/* VAT Calculation Modal */}
      {showVatForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Percent className="text-green-700" size={20} /> VAT Calculation
              </h3>
              <button
                onClick={() => setShowVatForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>
            <form className="px-6 py-4" onSubmit={handleVatFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Sales
                </label>
                <input
                  type="number"
                  required
                  value={vatForm.totalSales}
                  onChange={e =>
                    setVatForm({ ...vatForm, totalSales: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="SAR"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taxable Sales
                </label>
                <input
                  type="number"
                  required
                  value={vatForm.taxableSales}
                  onChange={e =>
                    setVatForm({ ...vatForm, taxableSales: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="SAR"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchases
                </label>
                <input
                  type="number"
                  required
                  value={vatForm.purchases}
                  onChange={e =>
                    setVatForm({ ...vatForm, purchases: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="SAR"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VAT Rate
                </label>
                <select
                  value={vatForm.vatRate}
                  onChange={e =>
                    setVatForm({ ...vatForm, vatRate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="0.05">5%</option>
                  <option value="0.10">10%</option>
                  <option value="0.15">15%</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <CheckCircle size={16} />
                  <span>Calculate</span>
                </button>
                <button
                  onClick={() => setShowVatForm(false)}
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
                >
                  <XCircle size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Integration Status */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center mb-4">
          <CheckCircle className="text-blue-600 mr-2" size={20} />
          <h3 className="font-medium text-blue-800">POS & ZATCA Integration Active</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
          <div>
            <strong>VAT/Sales Tax:</strong> All sales and purchases synced for tax reporting.
          </div>
          <div>
            <strong>ZATCA Compliance:</strong> E-invoice data auto-validated and filed per ZATCA rules.
          </div>
          <div>
            <strong>Automated Posting:</strong> POS transactions post VAT entries in real time.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxReporting;