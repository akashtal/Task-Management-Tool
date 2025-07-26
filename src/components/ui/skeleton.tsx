import React from 'react';
import { cn } from '@/lib/utils'; // optional utility for conditional classNames

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
  );
}
