'use client';

import {
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import * as React from 'react';

interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export function Form({ children, ...props }: FormProps) {
  return <form {...props}>{children}</form>;
}

// Strongly typed generic field props
interface FormFieldProps<T extends FieldValues, K extends Path<T>> {
  render: (props: ControllerRenderProps<T, K>) => React.ReactNode;
  name: K;
}

export function FormField<T extends FieldValues, K extends Path<T>>({
  render,
  name,
}: FormFieldProps<T, K>) {
  return <>{render({ name } as ControllerRenderProps<T, K>)}</>;
}

export function FormItem({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>;
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function FormMessage({ children }: { children?: React.ReactNode }) {
  return <p className="text-sm text-red-500">{children}</p>;
}
