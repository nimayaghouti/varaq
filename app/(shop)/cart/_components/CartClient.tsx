'use client';

import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

import Link from 'next/link';

import { BookImage } from '@/components/shared/BookImage';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { useCart } from '@/hooks';

import { formatPrice } from '@/lib/format';

export function CartClient() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    isMounted,
  } = useCart();

  if (!isMounted) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">
        در حال بارگذاری سبد خرید...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 bg-card border border-border/50 rounded-2xl shadow-sm">
        <div className="bg-muted p-6 rounded-full">
          <ShoppingBag className="size-16 text-muted-foreground/50" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            سبد خرید شما خالی است
          </h2>
          <p className="text-muted-foreground">
            هنوز هیچ کتابی به سبد خرید خود اضافه نکرده‌اید.
          </p>
        </div>
        <Button asChild size="lg" className="mt-4 rounded-xl cursor-pointer">
          <Link href="/books">مشاهده فروشگاه کتاب</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full bg-card border border-border/50 rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">لیست سفارشات</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <Trash2 className="size-4 ml-2" />
            خالی کردن سبد
          </Button>
        </div>
        <Separator className="mb-6" />

        <div className="flex flex-col gap-6">
          {items.map(item => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center"
            >
              <Link
                href={`/books/${item.id}`}
                className="shrink-0 relative h-28 w-20 md:h-32 md:w-24 rounded-lg overflow-hidden border border-border bg-muted"
              >
                <BookImage
                  src={item.cover_image}
                  alt={`جلد کتاب ${item.title}`}
                  fill
                  sizes="(max-width: 768px) 80px, 96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-col flex-1 gap-2 w-full">
                <Link
                  href={`/books/${item.id}`}
                  className="font-bold text-lg hover:text-primary transition-colors line-clamp-1"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-muted-foreground">{item.author}</p>
                <div className="font-bold text-primary mt-1">
                  {formatPrice(item.price)}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                <div className="flex items-center gap-3 bg-muted/50 p-1 rounded-lg border border-border/50">
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-md cursor-pointer hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    title={
                      item.quantity >= item.stock
                        ? 'به سقف موجودی رسیده‌اید'
                        : ''
                    }
                  >
                    <Plus className="size-4" />
                  </Button>
                  <span className="w-4 text-center font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-md cursor-pointer hover:bg-background"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="size-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-80 shrink-0 sticky top-24 bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <h2 className="text-xl font-bold">خلاصه سفارش</h2>
        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>تعداد اقلام:</span>
            <span className="font-medium text-foreground">
              {items.length} کالا
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>هزینه ارسال:</span>
            <span className="font-medium text-foreground">رایگان</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">مبلغ کل:</span>
          <span className="font-bold text-xl text-primary">
            {formatPrice(getTotalPrice())}
          </span>
        </div>

        <Button
          asChild
          size="lg"
          className="w-full font-bold rounded-xl text-base mt-2 cursor-pointer"
        >
          <Link href="/checkout">تکمیل خرید</Link>
        </Button>
      </div>
    </div>
  );
}
