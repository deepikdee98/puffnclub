'use client';

import * as React from 'react';

export type ToastActionElement = React.ReactElement;

export interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'default' | 'destructive';
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ open, onOpenChange, variant = 'default', ...props }, ref) => {
    return null; // Minimal implementation
  }
);

Toast.displayName = 'Toast';