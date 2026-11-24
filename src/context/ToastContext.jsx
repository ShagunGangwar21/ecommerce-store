import React, { createContext, useState, useContext } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Render Box */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl text-white transform transition-all duration-300 animate-bounce-short ${
              toast.type === "success"
                ? "bg-gradient-to-r from-emerald-600 to-green-600"
                : toast.type === "error"
                ? "bg-gradient-to-r from-rose-600 to-red-600"
                : "bg-gradient-to-r from-blue-600 to-indigo-600"
            }`}
          >
            <div className="flex items-center gap-3 font-medium text-sm">
              {toast.type === "success" && <FaCheckCircle className="text-xl shrink-0" />}
              {toast.type === "error" && <FaExclamationCircle className="text-xl shrink-0" />}
              {toast.type === "info" && <FaInfoCircle className="text-xl shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-white/80 hover:text-white transition"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
