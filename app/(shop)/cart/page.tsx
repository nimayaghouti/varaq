import { Metadata } from 'next';

import { CartClient } from './_components/CartClient';

export const metadata: Metadata = {
  title: 'سبد خرید',
  description: 'بررسی و تکمیل فرآیند خرید کتاب در کتابفروشی ورق.',
};

export default function CartPage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col gap-2 bg-muted/30 p-8 rounded-2xl border border-border/50">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          سبد خرید
        </h1>
        <p className="text-muted-foreground">
          بررسی و ویرایش سفارشات پیش از پرداخت نهایی
        </p>
      </div>

      <CartClient />
    </div>
  );
}
