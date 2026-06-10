'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'خانه' },
  { href: '/books', label: 'فروشگاه' },
  { href: '/genres', label: 'دسته‌بندی‌ها' },
  { href: '/about', label: 'درباره ما' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navLinks.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'text-sm transition-colors hover:text-primary font-medium',
            pathname === link.href
              ? 'text-primary font-bold'
              : 'text-muted-foreground',
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
