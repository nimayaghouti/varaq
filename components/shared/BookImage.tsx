'use client';

import { BookOpen } from 'lucide-react';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

interface BookImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string | null;
  alt: string;
}

export function BookImage({ src, alt, className, ...props }: BookImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-muted/40 border border-border/30 text-muted-foreground overflow-hidden',
          className,
        )}
        {...(props.fill
          ? {
              style: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              },
            }
          : {})}
      >
        <BookOpen className="size-1/3 opacity-20 mb-2 drop-shadow-sm" />
        <span className="text-[10px] sm:text-xs opacity-40 px-2 text-center line-clamp-2 font-medium">
          {alt.replace('جلد کتاب', '').trim()}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
