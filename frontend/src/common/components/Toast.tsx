import { motion, AnimatePresence } from 'framer-motion';
import { Copy } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export const Toast = ({ message, isVisible }: ToastProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-1/10 left-1/2 z-50 -translate-x-1/2 translate-y-1/2"
        >
          <div className="flex items-center gap-3 rounded-full bg-slate-100 px-6 py-4 shadow-lg">
            <Copy className="h-5 w-5 text-slate-700" />
            <span className="text-sm font-medium text-slate-800">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
