// src/components/ui/use-toast.tsx
'use client'

import * as React from 'react'
import { ToastProps } from '@radix-ui/react-toast'

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

type ToastActionElement = React.ReactElement

const ToastContext = React.createContext<{
  toasts: ToasterToast[]
  addToast: (toast: ToasterToast) => void
  removeToast: (id: string) => void
} | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return {
    toast: context.addToast,
    toasts: context.toasts,
    removeToast: context.removeToast,
  }
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  const addToast = (toast: ToasterToast) => {
    setToasts((prev) => [...prev, { ...toast, id: crypto.randomUUID() }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}
