"use client";

import { toast } from "sonner";

export const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    default:
      toast(message);
  }
};

// For backward compatibility, replace showAlert() calls
export const alert = (message: string) => {
  toast(message);
};
