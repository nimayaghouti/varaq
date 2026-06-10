'use client';

import { Menu } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'خانه' },
  { href: '/books', label: 'فروشگاه' },
  { href: '/genres', label: 'دسته‌بندی‌ها' },
  { href: '/search', label: 'جستجوی پیشرفته' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary cursor-pointer"
          >
            <Menu className="size-6" />
            <span className="sr-only">منوی اصلی</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-75 flex flex-col px-6 pt-12"
          aria-describedby={undefined}
        >
          <SheetHeader>
            <SheetTitle className="flex justify-center items-center relative">
              <Image
                src="/logo.svg"
                alt="varaq logo"
                className="size-32"
                width={128}
                height={128}
                loading="eager"
              />
            </SheetTitle>
            <div className="absolute top-2.5 left-2.5">
              <ThemeToggle />
            </div>
          </SheetHeader>

          <Separator className="mb-6" />

          <nav className="flex flex-col gap-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'text-base py-2 transition-colors hover:text-primary font-medium',
                  pathname === link.href
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
