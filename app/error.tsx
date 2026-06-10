'use client';

import { AlertOctagon, RotateCcw } from 'lucide-react';

import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error Caught:', error);

    toast.error('خطایی در سیستم رخ داده است', {
      description: 'لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید.',
    });
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="bg-destructive/10 p-6 rounded-full border border-destructive/20 text-destructive">
        <AlertOctagon className="size-20" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          متأسفانه مشکلی پیش آمد!
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          دریافت اطلاعات با خطا مواجه شد. این مشکل ممکن است به دلیل قطعی اینترنت
          یا سرور باشد.
        </p>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() => reset()}
          size="lg"
          className="rounded-xl gap-2 font-bold cursor-pointer"
        >
          <RotateCcw className="size-5" />
          تلاش مجدد
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-xl cursor-pointer"
        >
          <Link href="/">بازگشت به خانه</Link>
        </Button>
      </div>
    </div>
  );
}
