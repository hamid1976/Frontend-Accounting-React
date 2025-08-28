import React from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-40 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ease-in-out ${
            toast.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : toast.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex-shrink-0">
            {toast.type === 'success' && <CheckCircle size={20} className="text-green-600" />}
            {toast.type === 'error' && <XCircle size={20} className="text-red-600" />}
            {toast.type === 'info' && <AlertCircle size={20} className="text-blue-600" />}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className={`ml-3 flex-shrink-0 rounded-md p-1.5 inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              toast.type === 'success' 
                ? 'text-green-400 hover:bg-green-100 focus:ring-green-600' 
                : toast.type === 'error'
                ? 'text-red-400 hover:bg-red-100 focus:ring-red-600'
                : 'text-blue-400 hover:bg-blue-100 focus:ring-blue-600'
            }`}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;