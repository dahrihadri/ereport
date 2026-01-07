'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast = ({ id, type, title, message, duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
    error: <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
    warning: <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
    info: <Info className="w-5 h-5 sm:w-6 sm:h-6" />,
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`w-full sm:max-w-md ${styles[type]} border-2 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 mb-3`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`flex-shrink-0 ${iconColors[type]}`}>
          {icons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold mb-1">{title}</h3>
          {message && (
            <p className="text-xs sm:text-sm opacity-90">{message}</p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-white/50 rounded-lg"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;
