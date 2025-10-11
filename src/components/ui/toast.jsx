import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props} />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-3 overflow-hidden rounded-xl border-2 p-4 pr-8 shadow-xl backdrop-blur-sm transition-all duration-300 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full hover:shadow-2xl hover:scale-[1.02]',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white/95 text-black shadow-lg',
        success: 'border-black bg-black text-white shadow-xl',
        destructive: 'border-red-200 bg-red-50/95 text-red-900 shadow-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    (<ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props} />)
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-3 text-sm font-semibold text-black transition-all hover:bg-black hover:text-white hover:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props} />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-lg p-1.5 text-gray-500 opacity-0 transition-all hover:text-black hover:bg-gray-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-black group-hover:opacity-100 group-[.success]:text-gray-400 group-[.success]:hover:text-white group-[.success]:hover:bg-white/20 group-[.destructive]:text-red-400 group-[.destructive]:hover:text-red-600 group-[.destructive]:hover:bg-red-100',
      className
    )}
    toast-close=""
    {...props}>
    <X className="h-4 w-4" strokeWidth={2.5} />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-bold tracking-tight [&+div]:text-xs', className)}
    {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn('text-sm opacity-80 font-medium', className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export { Toast, ToastAction,ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport };
