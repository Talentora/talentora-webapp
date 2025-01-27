import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { CircleAlert } from 'lucide-react';

import { cn } from '@/utils/cn';

const alertVariants = cva('relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground', {
  variants: {
    intent: {
      info: 'bg-background text-foreground',
      danger: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive'
    }
  },
  defaultVariants: {
    intent: 'info'
  }
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof alertVariants> {}

export const Alert: React.FC<AlertProps> = ({ children, intent, title }) => {
  return (
    <div className={alertVariants({ intent })}>
      <AlertTitle>
        {intent === 'danger' && <CircleAlert size={18} />}
        {title}
      </AlertTitle>
      {children}
    </div>
  );
};

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'mb-1 font-medium leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';
