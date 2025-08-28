import React, { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "./AccountsReceivableUtils/formatters";
import { RefreshCw, CheckCircle, Clock, XCircle } from "lucide-react";

const APPaymentsTab = ({ allSalesData, getCustomerName }) => {
  const [payments, setPayments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    invoiceId: "",
    customer: "",
    date: "",
    amount: "",
    method: "",
    accountName: "",
    accountType: "",
    status: "",
    memo: "",
  });

  const loadPayments = () => {
    const storedPayments = JSON.parse(localStorage.getItem("payments") || "[]");
    const sortedPayments = storedPayments.sort(
      (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
    );
    setPayments(sortedPayments);
  };

  useEffect(() => {
    loadPayments();
    const handleStorageChange = (e) => {
      if (e.key === "payments") {
        loadPayments();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const refreshData = () => {
    setRefreshing(true);
    loadPayments();
    setTimeout(() => setRefreshing(false), 500);
  };

  const paidOrders =
    allSalesData?.filter((order) => order.paid && order.fulfilled) || [];
  const combinedPayments = [...payments];
  paidOrders.forEach((order) => {
    const hasPaymentRecord = payments.some((p) => p.invoiceId === order.orderId);
    if (!hasPaymentRecord) {
      combinedPayments.push({
        id: `API-${order.orderId}`,
        invoiceId: order.orderId,
        customerId: order.customerId,
        date: order.paymentDate || order.createdAt,
        amount: order.total,
        paymentMethod: order.paymentMethod || "Not specified",
        accountType: order.accountType,
        status: "paid",
        source: "api",
      });
    }
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
      case "completed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "partial":
        return <Clock size={16} className="text-orange-600" />;
      case "failed":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (payment) => {
    const status = payment.status || "paid";
    const statusStyles = {
      paid: "bg-green-100 text-green-800",
      completed: "bg-green-100 text-green-800",
      partial: "bg-orange-100 text-orange-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
        {payment.remainingAmount > 0 && (
          <span className="ml-1 text-xs">
            ({formatCurrency(payment.remainingAmount)} remaining)
          </span>
        )}
      </span>
    );
  };

  const getPaymentMethodLabel = (method) => {
    const methodLabels = {
      cash: "Cash",
      check: "Check",
      bank_transfer: "Bank Transfer",
      credit_card: "Credit Card",
      debit_card: "Debit Card",
      online: "Online Payment",
      eft: "Electronic Funds Transfer",
    };
    return methodLabels[method] || method || "Not specified";
  };

  const getAccountTypeLabel = (type) => {
    switch (type) {
      case "Assets":
        return "Assets";
      case "Liabilities":
        return "Liabilities";
      case "Equity":
        return "Equity";
      case "Income":
        return "Income";
      case "Expense":
        return "Expense";
      default:
        return type || "Not specified";
    }
  };

  // 🔍 Apply filters
  const filteredPayments = combinedPayments.filter((p) => {
    return (
      (!filters.invoiceId || String(p.invoiceId).includes(filters.invoiceId)) &&
      (!filters.customer ||
        (getCustomerName(p.customerId) || "Walk-in Customer")
          .toLowerCase()
          .includes(filters.customer.toLowerCase())) &&
      (!filters.method ||
        getPaymentMethodLabel(p.paymentMethod) === filters.method) &&
      (!filters.accountName ||
        (p.accountName || "Not specified") === filters.accountName) &&
      (!filters.accountType ||
        getAccountTypeLabel(p.accountType) === filters.accountType) &&
      (!filters.status || (p.status || "paid") === filters.status)
    );
  });

  // 🔽 Collect unique filter values
  const uniqueValues = (key, mapper) =>
    Array.from(
      new Set(combinedPayments.map((p) => mapper(p) || "Not specified"))
    );

  const customers = uniqueValues("customer", (p) =>
    getCustomerName(p.customerId) || "Walk-in Customer"
  );
  const methods = uniqueValues("method", (p) =>
    getPaymentMethodLabel(p.paymentMethod)
  );
  const accounts = uniqueValues("accountName", (p) => p.accountName);
  const types = uniqueValues("accountType", (p) =>
    getAccountTypeLabel(p.accountType)
  );
  const statuses = uniqueValues("status", (p) => p.status || "paid");

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Payment History
            </h3>
            <button
              onClick={refreshData}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Invoice ID",
                  "Customer",
                  "Payment Date",
                  "Amount",
                  "Payment Method",
                  "Account Name",
                  "Account Type",
                  "Status",
                  "Memo",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-100">
                <th className="px-6 py-2">
                  <input
                    className="w-full border rounded px-2 py-1 text-xs"
                    placeholder="Filter..."
                    value={filters.invoiceId}
                    onChange={(e) =>
                      setFilters({ ...filters, invoiceId: e.target.value })
                    }
                  />
                </th>
                <th className="px-6 py-2">
                  <select
                    className="w-full border rounded px-2 py-1 text-xs"
                    value={filters.customer}
                    onChange={(e) =>
                      setFilters({ ...filters, customer: e.target.value })
                    }
                  >
                    <option value="">All</option>
                    {customers.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </th>
                <th></th>
                <th></th>
                <th className="px-6 py-2">
                  <select
                    className="w-full border rounded px-2 py-1 text-xs"
                    value={filters.method}
                    onChange={(e) =>
                      setFilters({ ...filters, method: e.target.value })
                    }
                  >
                    <option value="">All</option>
                    {methods.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </th>
                <th className="px-6 py-2">
                  <select
                    className="w-full border rounded px-2 py-1 text-xs"
                    value={filters.accountName}
                    onChange={(e) =>
                      setFilters({ ...filters, accountName: e.target.value })
                    }
                  >
                    <option value="">All</option>
                    {accounts.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </th>
                <th className="px-6 py-2">
                  <select
                    className="w-full border rounded px-2 py-1 text-xs"
                    value={filters.accountType}
                    onChange={(e) =>
                      setFilters({ ...filters, accountType: e.target.value })
                    }
                  >
                    <option value="">All</option>
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </th>
                <th className="px-6 py-2">
                  <select
                    className="w-full border rounded px-2 py-1 text-xs"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="">All</option>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.invoiceId || payment.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.customerId
                      ? getCustomerName(payment.customerId) ||
                        "Unknown Customer"
                      : "Walk-in Customer"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(payment.date || payment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">
                      {formatCurrency(payment.amount || payment.total)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPaymentMethodLabel(payment.paymentMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.accountName || "Not specified"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getAccountTypeLabel(payment.accountType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="max-w-xs truncate">
                      {payment.memo || "-"}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <XCircle size={48} className="mb-3 text-gray-300" />
                      <p className="text-lg font-medium">
                        No payments found
                      </p>
                      <p className="text-sm mt-1">
                        Adjust filters or add new payments
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredPayments.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                Showing {filteredPayments.length} payment
                {filteredPayments.length !== 1 ? "s" : ""}
              </div>
              <div className="font-medium text-gray-900">
                Total:{" "}
                {formatCurrency(
                  filteredPayments.reduce(
                    (sum, p) => sum + (p.amount || p.total || 0),
                    0
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default APPaymentsTab;
