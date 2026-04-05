import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ toasts = [], onClose }) => {
  return (
    <div className="fixed top-10 right-10 z-[200] space-y-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="pointer-events-auto bg-white border-l-4 border-[#54bd95] p-6 pr-12 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-4 border border-[#E2E8F0]"
          >
            <div className="w-10 h-10 rounded-full bg-[#54bd95]/10 flex items-center justify-center text-[#54bd95] shrink-0">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-[#0F172A]">{toast.message}</p>
            </div>
            <button 
              onClick={() => onClose(toast.id)}
              className="absolute top-4 right-4 p-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
