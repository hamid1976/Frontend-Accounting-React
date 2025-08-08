// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ChartOfAccounts from "../pages/ChartOfAccounts";
import GeneralLedger from "../pages/GeneralLedger";
import AccountsReceivable from "../pages/AccountsReceivable";
import AccountsPayable from "../pages/AccountsPayable";
import FinancialStatements from "../pages/FinancialStatements";
import ManagementReports from "../pages/ManagementReports";
import TaxReporting from "../pages/TaxReporting";
import SidebarLayout from "../layout/SidebarLayout";

const AppRoutes = () => {
  return (
    <Routes>
    <Route path="/" element={<SidebarLayout />} />
      <Route path="/charts-of-account" element={<ChartOfAccounts />} />
      <Route path="/general-ledger" element={<GeneralLedger />} />
      <Route path="/accounts-receivable" element={<AccountsReceivable/>} />
      <Route path="/accounts-payable" element={<AccountsPayable/>} />
            <Route path="/financial-statements" element={<FinancialStatements/>} />
            <Route path="/management-reports" element={<ManagementReports/>} />

             <Route path="/tax-reporting" element={<TaxReporting/>} />

    </Routes>
  );
};

export default AppRoutes;
