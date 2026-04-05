import React from 'react';
import { Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", cancelText = "Cancel" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white p-10 rounded-2xl max-w-md w-full shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-[#F1F5F9]"
          >
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 mx-auto">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-black text-[#0F172A] mb-3 text-center">{title}</h3>
            <p className="text-[#64748B] text-center font-medium mb-10 leading-relaxed">
              {message}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={onCancel}
                className="flex-1 px-6 py-4 rounded-xl font-bold text-[#64748B] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all active:scale-95"
              >
                {cancelText}
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 px-6 py-4 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
              >
                {confirmText}
              </button>
            </div>
            <button onClick={onCancel} className="absolute top-6 right-6 p-2 text-[#94A3B8] hover:text-[#0F172A] transition-colors">
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
