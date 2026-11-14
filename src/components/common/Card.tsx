import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverEffect = false, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm text-slate-100',
        hoverEffect && 'transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
