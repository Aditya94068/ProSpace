import React, { useState } from 'react';
import { cn, getInitials } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  statusIndicator?: 'online' | 'busy' | 'offline';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  statusIndicator,
  className,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const indicatorSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };

  const indicators = {
    online: 'bg-emerald-500',
    busy: 'bg-amber-500',
    offline: 'bg-slate-500',
  };

  const initials = getInitials(name);

  // Consistent background color hash based on initials
  const colors = [
    'from-indigo-600 to-purple-600',
    'from-blue-600 to-cyan-600',
    'from-emerald-600 to-teal-600',
    'from-rose-600 to-pink-600',
    'from-amber-600 to-orange-600',
    'from-violet-600 to-indigo-600',
  ];
  const charCode = (initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0);
  const colorGradient = colors[charCode % colors.length];

  return (
    <div className={cn('relative inline-flex shrink-0 select-none', className)} {...props}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-semibold overflow-hidden border border-slate-700/60 shadow-sm',
          sizes[size],
          !src || hasError ? `bg-gradient-to-br ${colorGradient} text-white` : 'bg-slate-800'
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {statusIndicator && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-slate-950',
            indicatorSizes[size],
            indicators[statusIndicator]
          )}
        />
      )}
    </div>
  );
};
