import { useState, useCallback } from 'react';

export const useToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showToast = useCallback((msg: string, duration = 2000) => {
    setMessage(msg);
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, duration);
  }, []);

  return {
    isVisible,
    message,
    showToast,
  };
};
