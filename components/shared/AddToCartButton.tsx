'use client';

import { ShoppingBag } from 'lucide-react';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useCartStore } from '@/store/cart-store';

import { Book } from '@/types';

interface AddToCartButtonProps extends React.ComponentProps<typeof Button> {
  book: Book;
}

export function AddToCartButton({
  book,
  children,
  className,
  ...props
}: AddToCartButtonProps) {
  const items = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const router = useRouter();

  const currentQuantityInCart =
    items.find(item => item.id === book.id)?.quantity || 0;
  const isMaxReached = currentQuantityInCart >= book.stock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isMaxReached) return;

    addItem(book);

    toast.success('به سبد خرید اضافه شد', {
      description: book.title,
      action: {
        label: 'مشاهده سبد',
        onClick: () => router.push('/cart'),
      },
    });
  };

  if (isMaxReached) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-not-allowed">
            <Button
              className={className}
              disabled
              style={{ pointerEvents: 'none' }}
              {...props}
            >
              {children || (
                <>
                  <ShoppingBag className="size-4 sm:ml-1.5" />
                  <span className="hidden sm:inline">خرید</span>
                </>
              )}
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-destructive text-destructive-foreground font-bold [&>span>svg]:bg-destructive [&>span>svg]:fill-destructive">
          <p>سقف موجودی انبار</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button
      className={className}
      onClick={handleAddToCart}
      disabled={isMaxReached || props.disabled}
      {...props}
    >
      {children || (
        <>
          <ShoppingBag className="size-4 sm:ml-1.5" />
          <span className="hidden sm:inline">خرید</span>
        </>
      )}
    </Button>
  );
}
