// // src/routes/AppRoutes.jsx
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import ChartOfAccounts from "../pages/ChartOfAccounts";
// import GeneralLedger from "../pages/GeneralLedger";
// import AccountsReceivable from "../pages/AccountsReceivable";
// import AccountsPayable from "../pages/AccountsPayable";
// import FinancialStatements from "../pages/FinancialStatements";
// import ManagementReports from "../pages/ManagementReports";
// import TaxReporting from "../pages/TaxReporting";
// import SidebarLayout from "../layout/SidebarLayout";

// const AppRoutes = () => {
//   return (
//     <Routes>
//     <Route path="/" element={<SidebarLayout />} />
//       <Route path="/charts-of-account" element={<ChartOfAccounts />} />
//       <Route path="/general-ledger" element={<GeneralLedger />} />
//       <Route path="/accounts-receivable" element={<AccountsReceivable/>} />
//       <Route path="/accounts-payable" element={<AccountsPayable/>} />
//             <Route path="/financial-statements" element={<FinancialStatements/>} />
//             <Route path="/management-reports" element={<ManagementReports/>} />

//              <Route path="/tax-reporting" element={<TaxReporting/>} />

//     </Routes>
//   );
// };

// export default AppRoutes;


// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "../layout/SidebarLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect to accounts receivable */}
      <Route path="/" element={<Navigate to="/accounts-receivable" replace />} />
      
      {/* All routes use SidebarLayout which will handle component switching internally */}
      <Route path="/charts-of-account" element={<SidebarLayout />} />
      <Route path="/general-ledger" element={<SidebarLayout />} />
      <Route path="/accounts-receivable" element={<SidebarLayout />} />
      <Route path="/accounts-payable" element={<SidebarLayout />} />
      <Route path="/financial-statements" element={<SidebarLayout />} />
      <Route path="/management-reports" element={<SidebarLayout />} />
      <Route path="/tax-reporting" element={<SidebarLayout />} />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/accounts-receivable" replace />} />
    </Routes>
  );
};

export default AppRoutes;