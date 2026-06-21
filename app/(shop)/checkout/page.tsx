import { Metadata } from 'next';

import { CheckoutClient } from './_components/CheckoutClient';

export const metadata: Metadata = {
  title: 'تسویه حساب',
};

export default function CheckoutPage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col gap-2 bg-muted/30 p-8 rounded-2xl border border-border/50">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          تسویه حساب و پرداخت
        </h1>
        <p className="text-muted-foreground">
          لطفاً اطلاعات ارسال را با دقت تکمیل کنید.
        </p>
      </div>

      <CheckoutClient />
    </div>
  );
}
