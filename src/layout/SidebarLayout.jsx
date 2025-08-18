// import React, { useState } from "react";
// import {
//   CreditCard,
//   BarChart2,
//   FileText,
//   Percent,
//   BookOpen,
//   List,
// } from "lucide-react";

// // Page imports
// import AccountsReceivable from "../pages/AccountsReceivable";
// import AccountsPayable from "../pages/AccountsPayable";
// import FinancialStatements from "../pages/FinancialStatements";
// import ManagementReports from "../pages/ManagementReports";
// import TaxReporting from "../pages/TaxReporting";
// import GeneralLedger from "../pages/GeneralLedger";
// import ChartOfAccounts from "../pages/ChartOfAccounts";
// import Footer from "./Footer";

// const navOptions = [
//   {
//     key: "COA",
//     label: "Charts Of Account",
//     icon: <List size={18} />,
//     component: ChartOfAccounts,
//   },
//   {
//     key: "ledger",
//     label: "General Ledger",
//     icon: <BookOpen size={18} />,
//     component: GeneralLedger,
//   },
//   {
//     key: "ar",
//     label: "Accounts Receivable",
//     icon: <CreditCard size={18} />,
//     component: AccountsReceivable,
//   },
//   {
//     key: "ap",
//     label: "Accounts Payable",
//     icon: <CreditCard size={18} />,
//     component: AccountsPayable,
//   },
//   {
//     key: "statements",
//     label: "Financial Statements",
//     icon: <FileText size={18} />,
//     component: FinancialStatements,
//   },
//   {
//     key: "mgmt-reports",
//     label: "Management Reports",
//     icon: <BarChart2 size={18} />,
//     component: ManagementReports,
//   },
//   {
//     key: "tax",
//     label: "Tax Reporting",
//     icon: <Percent size={18} />,
//     component: TaxReporting,
//   },
// ];

// const SidebarLayout = () => {
//   const [selectedKey, setSelectedKey] = useState("ar");
//   const SelectedComponent =
//     navOptions.find((opt) => opt.key === selectedKey)?.component || AccountsReceivable;

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Layout: Sidebar + Main Content */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside className="w-72 bg-white shadow-sm border-r border-gray-200 flex flex-col">
//           {/* Logo/Header */}
//           <div className="h-20 flex items-center justify-center border-b border-gray-100">
//             <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition">
//               <BarChart2 size={28} className="text-emerald-600" />
//               <span className="font-bold text-xl text-gray-800 tracking-tight">HULM</span>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 py-6 px-3 overflow-y-auto custom-scroll">
//             <ul className="space-y-2">
//               {navOptions.map((opt) => (
//                 <li key={opt.key}>
//                   <button
//                     aria-label={opt.label}
//                     className={`group w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
//                       selectedKey === opt.key
//                         ? "bg-emerald-50 text-emerald-700 shadow-sm"
//                         : "text-gray-700 hover:bg-gray-100"
//                     }`}
//                     onClick={() => setSelectedKey(opt.key)}
//                   >
//                     {/* Active indicator bar */}
//                     <span
//                       className={`absolute left-0 top-0 h-full w-1 rounded-r-md ${
//                         selectedKey === opt.key ? "bg-emerald-500" : "bg-transparent"
//                       }`}
//                     ></span>
//                     <span className="text-emerald-600">{opt.icon}</span>
//                     <span className="truncate">{opt.label}</span>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </aside>

//         {/* Main Content Area */}
//         <main className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
//           <div className="w-full max-w-6xl mx-auto transition-all duration-300">
//             <SelectedComponent />
//           </div>
//         </main>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 text-sm text-gray-500 text-center py-4">
//         <Footer />
//       </footer>
//     </div>
//   );
// };

// export default SidebarLayout;




import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard,
  BarChart2,
  FileText,
  Percent,
  BookOpen,
  List,
} from "lucide-react";

// Page imports
import AccountsReceivable from "../pages/AccountsReceivable";
import AccountsPayable from "../pages/AccountsPayable";
import FinancialStatements from "../pages/FinancialStatements";
import ManagementReports from "../pages/ManagementReports";
import TaxReporting from "../pages/TaxReporting";
import GeneralLedger from "../pages/GeneralLedger";
import ChartOfAccounts from "../pages/ChartOfAccounts";
import Footer from "./Footer";

const navOptions = [
  {
    key: "COA",
    label: "Charts Of Account",
    icon: <List size={18} />,
    component: ChartOfAccounts,
    path: "/charts-of-account"
  },
  {
    key: "ledger",
    label: "General Ledger",
    icon: <BookOpen size={18} />,
    component: GeneralLedger,
    path: "/general-ledger"
  },
  {
    key: "ar",
    label: "Accounts Receivable",
    icon: <CreditCard size={18} />,
    component: AccountsReceivable,
    path: "/accounts-receivable"
  },
  {
    key: "ap",
    label: "Accounts Payable",
    icon: <CreditCard size={18} />,
    component: AccountsPayable,
    path: "/accounts-payable"
  },
  {
    key: "statements",
    label: "Financial Statements",
    icon: <FileText size={18} />,
    component: FinancialStatements,
    path: "/financial-statements"
  },
  {
    key: "mgmt-reports",
    label: "Management Reports",
    icon: <BarChart2 size={18} />,
    component: ManagementReports,
    path: "/management-reports"
  },
  {
    key: "tax",
    label: "Tax Reporting",
    icon: <Percent size={18} />,
    component: TaxReporting,
    path: "/tax-reporting"
  },
];

const SidebarLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("ar");

  // Update selected key based on current URL path
  useEffect(() => {
    const currentPath = location.pathname;
    const matchedOption = navOptions.find(option => option.path === currentPath);
    
    if (matchedOption) {
      setSelectedKey(matchedOption.key);
    } else {
      // Default to accounts receivable if no match found
      setSelectedKey("ar");
    }
  }, [location.pathname]);

  // Handle navigation when sidebar item is clicked
  const handleNavigation = (option) => {
    setSelectedKey(option.key);
    navigate(option.path);
  };

  // Get the component to render based on current URL
  const getActiveComponent = () => {
    const currentPath = location.pathname;
    const matchedOption = navOptions.find(option => option.path === currentPath);
    
    if (matchedOption) {
      return matchedOption.component;
    }
    
    // Default to AccountsReceivable if no match
    return AccountsReceivable;
  };

  const ActiveComponent = getActiveComponent();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Layout: Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-sm border-r border-gray-200 flex flex-col">
          {/* Logo/Header */}
          <div className="h-20 flex items-center justify-center border-b border-gray-100">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
              onClick={() => navigate("/accounts-receivable")}
            >
              <BarChart2 size={28} className="text-emerald-600" />
              <span className="font-bold text-xl text-gray-800 tracking-tight">HULM</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 overflow-y-auto custom-scroll">
            <ul className="space-y-2">
              {navOptions.map((opt) => (
                <li key={opt.key}>
                  <button
                    aria-label={opt.label}
                    className={`group w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
                      selectedKey === opt.key
                        ? "bg-emerald-50 text-emerald-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => handleNavigation(opt)}
                  >
                    {/* Active indicator bar */}
                    <span
                      className={`absolute left-0 top-0 h-full w-1 rounded-r-md ${
                        selectedKey === opt.key ? "bg-emerald-500" : "bg-transparent"
                      }`}
                    ></span>
                    <span className="text-emerald-600">{opt.icon}</span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto transition-all duration-300">
            {/* Render the active component based on URL */}
            <ActiveComponent />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-sm text-gray-500 text-center py-4">
        <Footer />
      </footer>
    </div>
  );
};

export default SidebarLayout;