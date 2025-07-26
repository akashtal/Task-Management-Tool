'use client'

import { FormProvider, useFormContext } from 'react-hook-form'
import * as React from 'react'

interface FormProps {
  children: React.ReactNode
  [key: string]: any
}

export function Form({ children, ...props }: FormProps) {
  return <form {...props}>{children}</form>
}

// Wrapper components for react-hook-form

export function FormField({ ...props }: any) {
  return <>{props.render(props)}</>
}

export function FormItem({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function FormMessage({ children }: { children?: React.ReactNode }) {
  return (
    <p className="text-sm text-red-500">
      {children}
    </p>
  )
}
