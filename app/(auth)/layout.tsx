import { ArrowRight } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import { StaticLayoutBackground } from '@/components/layout/StaticLayoutBackground';
import { Button } from '@/components/ui/button';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4 relative overflow-hidden">
      <StaticLayoutBackground />

      <div className="w-full mb-2 sm:ms-16 flex items-center justify-start">
        <Button
          variant="ghost"
          asChild
          className="text-muted-foreground hover:text-foreground cursor-pointer gap-2"
        >
          <Link href="/">
            <ArrowRight className="size-4" />
            بازگشت به خانه
          </Link>
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
        <Link
          href="/"
          className="flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Image
            src="/logo.svg"
            alt="varaq logo"
            className="size-32"
            width={64}
            height={64}
            loading="eager"
          />
        </Link>
        {children}
      </div>
    </div>
  );
}
