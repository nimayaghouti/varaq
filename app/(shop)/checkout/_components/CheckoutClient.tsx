'use client';

import { CreditCard, MapPin, ShieldCheck, ShoppingBag } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { useCart } from '@/hooks';

import { createOrderAndPay } from '@/lib/actions/payment';
import { formatPrice } from '@/lib/format';
import { CheckoutSchema } from '@/lib/validations/checkout';

type FormData = z.infer<typeof CheckoutSchema>;

export function CheckoutClient() {
  const { items, getTotalPrice, isMounted } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CheckoutSchema),
  });

  useEffect(() => {
    if (isMounted && items.length === 0) {
      router.push('/cart');
    }
  }, [isMounted, items, router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const cartData = items.map(item => ({
        id: item.id,
        quantity: item.quantity,
      }));

      const result = await createOrderAndPay(data, cartData);

      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
      } else if (result?.url) {
        toast.info('در حال انتقال به درگاه پرداخت...');
        window.location.assign(result.url);
      }
    } catch (error) {
      console.error(error);
      toast.error('خطای ناشناخته‌ای رخ داد.');
      setLoading(false);
    }
  };

  if (!isMounted || items.length === 0) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="size-5 text-primary" />
          <h2 className="text-xl font-bold">اطلاعات ارسال</h2>
        </div>
        <Separator className="mb-6" />

        <form
          id="checkout-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">نام و نام خانوادگی تحویل گیرنده</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="مثلاً: علی احمدی"
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">شماره موبایل</Label>
              <Input
                id="phone"
                {...register('phone')}
                dir="ltr"
                className="text-left"
                placeholder="09123456789"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">آدرس دقیق پستی</Label>
            <textarea
              id="address"
              {...register('address')}
              rows={3}
              placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
            {errors.address && (
              <p className="text-xs text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="w-full lg:w-96 shrink-0 flex flex-col gap-6">
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            فاکتور نهایی
          </h2>
          <Separator />

          <div className="flex flex-col gap-4 max-h-75 overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative size-12 rounded bg-muted overflow-hidden shrink-0">
                  <Image
                    src={item.cover_image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium line-clamp-1">
                    {item.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.quantity} عدد
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">مبلغ قابل پرداخت:</span>
            <span className="font-bold text-xl text-primary">
              {formatPrice(getTotalPrice())}
            </span>
          </div>

          <Button
            type="submit"
            form="checkout-form"
            size="lg"
            disabled={loading}
            className="w-full font-bold rounded-xl text-base mt-2 cursor-pointer gap-2"
          >
            {loading ? (
              'در حال اتصال به درگاه...'
            ) : (
              <>
                <CreditCard className="size-5" />
                پرداخت امن
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-green-600" />
          <span>پرداخت از طریق درگاه امن زرین‌پال / زیبال</span>
        </div>
      </div>
    </div>
  );
}
