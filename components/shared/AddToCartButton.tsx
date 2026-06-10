'use client';

import { ShoppingBag } from 'lucide-react';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

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
  const addItem = useCartStore(state => state.addItem);
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(book);

    toast.success('به سبد خرید اضافه شد', {
      description: book.title,
      action: {
        label: 'مشاهده سبد',
        onClick: () => router.push('/cart'),
      },
    });
  };

  return (
    <Button className={className} onClick={handleAddToCart} {...props}>
      {children || (
        <>
          <ShoppingBag className="size-4 sm:ml-1.5" />
          <span className="hidden sm:inline">خرید</span>
        </>
      )}
    </Button>
  );
}
