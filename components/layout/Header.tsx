import { Search } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import { CartButton } from '@/components/layout/CartButton';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Navigation } from '@/components/layout/Navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
        <MobileMenu />

        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="varaq logo"
            className="size-12 md:size-16"
            width={64}
            height={64}
            loading="eager"
          />
        </Link>

        <Navigation />

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden sm:flex hover:text-primary"
          >
            <Link href="/search" aria-label="جستجو">
              <Search className="size-5" />
            </Link>
          </Button>

          <CartButton />

          <div className="mx-1 h-6 w-px bg-border hidden sm:block"></div>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
