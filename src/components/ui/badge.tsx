import * as React from 'react';
import { cn } from '@/lib/utils'; // optional utility

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    outline: 'border border-input text-foreground',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};
