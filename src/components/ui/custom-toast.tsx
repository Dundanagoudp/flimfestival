"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

// Toast types
export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

const icons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
    </svg>
  ),
};

const barColors: Record<ToastType, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
};

const iconStyles: Record<ToastType, { container: string; icon: string }> = {
  success: { container: "bg-green-100 text-green-700", icon: "text-green-700" },
  error: { container: "bg-red-100 text-red-700", icon: "text-red-700" },
  warning: { container: "bg-yellow-100 text-yellow-700", icon: "text-yellow-700" },
  info: { container: "bg-blue-100 text-blue-700", icon: "text-blue-700" },
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: ToastType) => {
    setToasts((prev) => {
      // Remove any existing toast of the same type
      const filtered = prev.filter((t) => t.type !== type);
      const id = Date.now() + Math.random();
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, 3000);
      return [...filtered, { id, message, type }];
    });
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className="relative bg-white/95 backdrop-blur-sm shadow-xl rounded-md px-4 py-3 min-w-[300px] max-w-sm border animate-slide-in"
            style={{ boxShadow: "0 10px 24px rgba(0,0,0,0.12)" }}
          >
            <div className={`absolute left-0 top-0 h-full w-1 rounded-l-md ${barColors[toast.type]}`}></div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => removeToast(toast.id)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex items-center gap-3 pl-2 pr-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-1 ring-black/5 ${iconStyles[toast.type].container}`}>
                <span className={iconStyles[toast.type].icon}>{icons[toast.type]}</span>
              </div>
              <span className="font-semibold text-gray-900 tracking-tight">{toast.message}</span>
            </div>
            <div className={`h-1 mt-3 rounded ${barColors[toast.type]} animate-toast-bar`}></div>
          </div>
        ))}
      </div>
      {/* Global styles for toast animations */}
      <style>{`
        @keyframes toast-bar {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-toast-bar {
          animation: toast-bar 2.8s linear forwards;
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.18s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
}; 