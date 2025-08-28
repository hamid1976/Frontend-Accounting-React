// Utility/formatters.js

// Format date from "2025.08.18.10.08.54.569" to "2025/08/18"
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return dateString.split('.').slice(0, 3).join('/');
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Utility to safely parse yyyy-mm-dd as local date
export const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0); // local midnight
};
// Parse "YYYY.MM.DD.HH.mm.ss.SSS" into a local Date
export const parseDotTimestampToDate = (s) => {
  if (!s || typeof s !== 'string') return null;
  const [y, m, d, hh = '0', mm = '0', ss = '0', ms = '0'] = s.split('.');
  const year = Number(y), month = Number(m) - 1, day = Number(d);
  const h = Number(hh), mi = Number(mm), s2 = Number(ss), milli = Number(ms);
  if ([year, month, day].some(Number.isNaN)) return null;
  return new Date(year, month, day, h, mi, s2, milli);
};
