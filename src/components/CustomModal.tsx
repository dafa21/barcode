import React from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalConfig {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'success';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface CustomModalProps {
  config: ModalConfig;
  onClose: () => void;
}

export function CustomModal({ config, onClose }: CustomModalProps) {
  if (!config.isOpen) return null;

  const handleConfirm = () => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleCancel}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-gray-100 overflow-hidden"
        >
          {/* Top accent line */}
          <div className={`absolute top-0 left-0 w-full h-1.5 ${
            config.type === 'confirm' ? 'bg-amber-500' : 
            config.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          }`} />

          <div className="flex flex-col items-center text-center mt-2">
            {config.type === 'confirm' ? (
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
            ) : config.type === 'success' ? (
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
            )}
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">{config.title}</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{config.message}</p>
            
            <div className="flex gap-3 w-full justify-center">
              {config.type === 'confirm' && (
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors shadow-md ${
                  config.type === 'confirm' ? 'bg-amber-600 hover:bg-amber-700' : 
                  config.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {config.type === 'confirm' ? 'Ya, Lanjutkan' : 'Mengerti'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
