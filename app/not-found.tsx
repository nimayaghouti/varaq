import { FileQuestion, Home } from 'lucide-react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="bg-muted p-6 rounded-full border border-border/50">
        <FileQuestion className="size-20 text-muted-foreground/50" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          خطای ۴۰۴
        </h1>
        <h2 className="text-xl md:text-2xl font-medium text-muted-foreground">
          صفحه مورد نظر پیدا نشد!
        </h2>
      </div>

      <p className="text-muted-foreground max-w-md mx-auto">
        احتمالاً آدرس را اشتباه وارد کرده‌اید یا این صفحه از سایت حذف شده است.
      </p>

      <Button asChild size="lg" className="mt-4 rounded-xl gap-2">
        <Link href="/">
          <Home className="size-5" />
          بازگشت به صفحه اصلی
        </Link>
      </Button>
    </div>
  );
}
