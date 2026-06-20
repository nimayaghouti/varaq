'use client';

import { ShoppingBag } from 'lucide-react';

import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { CartItem } from '@/store/cart-store';

import { useCart } from '@/hooks/use-cart';

interface CartButtonProps {
  dbCartItems?: CartItem[] | null;
}

export function CartButton({ dbCartItems }: CartButtonProps) {
  const { items, setCart, isMounted } = useCart();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (dbCartItems !== undefined && dbCartItems !== null) {
      setCart(dbCartItems);
    }
  }, [dbCartItems, setCart]);

  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className="hover:text-primary relative cursor-pointer"
    >
      <Link href="/cart" aria-label="سبد خرید">
        <ShoppingBag className="size-5" />
        {isMounted && itemCount > 0 && (
          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
