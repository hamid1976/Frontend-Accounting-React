import React from "react";
 
const Footer = () => (
  <footer className="w-full bg-white border-t border-gray-200 mt-8">
    <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-2 mb-2 md:mb-0">
        <span>&copy; {new Date().getFullYear()} HULM</span>
        <span className="mx-2 hidden md:inline">|</span>
        <span className="text-gray-400">
          Finance Management Platform
        </span>
      </div>
      <div className="flex items-center gap-3">
        <a
          href="https://www.example.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-emerald-600 transition"
        >
          Privacy Policy
        </a>
        <span className="hidden md:inline text-gray-300">|</span>
        <a
          href="https://www.example.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-emerald-600 transition"
        >
          Terms of Service
        </a>
        <span className="hidden md:inline text-gray-300">|</span>
        <span>
          Built with <span className="text-emerald-600 font-semibold">HULM</span>
        </span>
      </div>
    </div>
  </footer>
);
 
export default Footer;