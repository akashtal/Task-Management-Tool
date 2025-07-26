// components/ui/toast.ts
import {
  ToastProvider,
  ToastViewport,
  Toast as RadixToast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@radix-ui/react-toast';
import { createContext, useContext, useState } from 'react';

export type ToastProps = {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive"; // ✅ add this line
};

const ToastContext = createContext<{
  toast: (props: ToastProps) => void;
} | null>(null);

export const Toast = ({ children }: { children: React.ReactNode }) => {
  const [toastData, setToastData] = useState<ToastProps | null>(null);

  const showToast = (data: ToastProps) => {
    setToastData(data);
    setTimeout(() => setToastData(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      <ToastProvider>
        {children}
        {toastData && (
          <RadixToast open>
            <div
              className={`p-4 rounded-md shadow-md ${
                toastData.variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'
              }`}
            >
              <ToastTitle>{toastData.title}</ToastTitle>
              {toastData.description && <ToastDescription>{toastData.description}</ToastDescription>}
              <ToastClose />
            </div>
          </RadixToast>
        )}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a <Toast> provider');
  return context;
};
