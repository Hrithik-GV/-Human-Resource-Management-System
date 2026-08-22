import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastWrapper = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#0f172a',
          fontSize: '14px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#f43f5e',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
};
