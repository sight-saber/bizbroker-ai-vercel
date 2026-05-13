"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: { bg: "#00D4AA", icon: "✓" },
    error: { bg: "#FF4444", icon: "✕" },
    info: { bg: "#4A9EFF", icon: "ℹ" },
    warning: { bg: "#FFB800", icon: "⚠" },
  };

  const config = colors[type];

  return (
    <div
      className="fixed top-4 right-4 z-[100] animate-slide-in-right"
      style={{
        animation: "slideInRight 0.3s ease-out",
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl min-w-[300px] max-w-[500px]"
        style={{
          background: `linear-gradient(135deg, ${config.bg}, ${config.bg}dd)`,
          border: `2px solid ${config.bg}`,
        }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
          style={{
            background: "rgba(0,0,0,0.2)",
            color: "#fff",
          }}
        >
          {config.icon}
        </div>
        <div className="flex-1 text-sm font-semibold text-white">
          {message}
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white text-xl leading-none transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: ToastType;
  }>;
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
