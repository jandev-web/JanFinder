import { useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const useToastSimple = () => {
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    // For now, we'll just use console.log to show the toast
    // In a real app, this would trigger a toast UI component
    console.log(`Toast [${type.toUpperCase()}]: ${message}`);
    
    // Create a simple browser alert for demonstration
    if (type === 'error') {
      alert(`Error: ${message}`);
    } else if (type === 'success') {
      alert(`Success: ${message}`);
    }
  }, []);

  return showToast;
};