'use client';

import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  XCircle,
} from 'lucide-react';

import Link from 'next/link';
import { useEffect } from 'react';

import { useCartStore } from '@/store/cart-store';

import { Button } from '@/components/ui/button';

interface PaymentResultProps {
  isSuccess: boolean;
  message: string;
  orderId?: string;
}

export function PaymentResult({
  isSuccess,
  message,
  orderId,
}: PaymentResultProps) {
  useEffect(() => {
    if (isSuccess) {
      useCartStore.getState().clearCart();
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col items-center justify-center py-16 bg-card border border-border/50 rounded-3xl shadow-sm text-center max-w-2xl mx-auto mt-8 px-2">
      {isSuccess ? (
        <CheckCircle2 className="size-24 text-green-500 mb-6" />
      ) : (
        <XCircle className="size-24 text-destructive mb-6" />
      )}

      <h1 className="text-3xl font-bold mb-4">
        {isSuccess ? 'پرداخت با موفقیت انجام شد!' : 'پرداخت ناموفق بود'}
      </h1>

      <p className="text-muted-foreground text-lg mb-8 max-w-md">{message}</p>

      {isSuccess && orderId && (
        <div className="bg-muted px-6 py-3 rounded-lg mb-8 text-sm font-medium">
          شماره سفارش:{' '}
          <span className="font-bold text-foreground" dir="ltr">
            {orderId}
          </span>
        </div>
      )}

      <div className="flex flex-wrap justify-center items-center gap-4">
        <Button
          asChild
          size="lg"
          className="rounded-xl font-bold cursor-pointer"
        >
          <Link href={isSuccess ? '/profile' : '/checkout'}>
            {isSuccess ? (
              <>
                <LayoutDashboard className="size-4 ml-2" /> مشاهده سفارشات
              </>
            ) : (
              'تلاش مجدد'
            )}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-xl cursor-pointer"
        >
          <Link href="/">
            <ArrowRight className="size-4 ml-2" /> بازگشت به خانه
          </Link>
        </Button>
      </div>
    </div>
  );
}
