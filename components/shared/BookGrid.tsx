import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface BookGridProps {
  children: ReactNode;
  className?: string;
  layout?: 'default' | 'compact';
}

export function BookGrid({
  children,
  className,
  layout = 'default',
}: BookGridProps) {
  return (
    <div
      className={cn(
        'grid gap-6',
        layout === 'default'
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
