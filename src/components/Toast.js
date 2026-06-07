import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Toast.css';

const Toast = ({ message, type = 'success', visible, onClose }) => {
  // Auto-fermer après 3 secondes
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  const toastVariants = {
    initial: { opacity: 0, y: -20, x: 300 },
    animate: { opacity: 1, y: 0, x: 0 },
    exit: { opacity: 0, y: -20, x: 300 },
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`toast-container toast-${type}`}
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <span className="toast-icon">{getIcon()}</span>
          <span className="toast-message">{message}</span>
          <button className="toast-close" onClick={onClose}>
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
