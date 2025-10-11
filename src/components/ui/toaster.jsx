import { CheckCircle2, Info, XCircle } from 'lucide-react';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  const getIcon = (variant) => {
    switch (variant) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 flex-shrink-0" strokeWidth={2.5} />;
      case 'destructive':
        return <XCircle className="h-5 w-5 flex-shrink-0" strokeWidth={2.5} />;
      default:
        return <Info className="h-5 w-5 flex-shrink-0" strokeWidth={2.5} />;
    }
  };

  return (
    (<ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          (<Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-0.5">
                {getIcon(variant)}
              </div>
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>)
        );
      })}
      <ToastViewport />
    </ToastProvider>)
  );
}
