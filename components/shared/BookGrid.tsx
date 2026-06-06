import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface BookGridProps {
  children: ReactNode;
  className?: string;
}

export function BookGrid({ children, className }: BookGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
