'use client';

import {
  ArrowRight,
  Book,
  LayoutDashboard,
  Menu,
  ShoppingCart,
} from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { cn } from '@/lib/utils';

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/books', label: 'مدیریت کتاب‌ها', icon: Book },
  { href: '/admin/orders', label: 'سفارشات', icon: ShoppingCart },
  // { href: "/admin/users", label: "کاربران", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarContent = (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 shrink-0">
        <span className="font-bold text-lg text-primary">پنل مدیریت ورق</span>
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
        {sidebarLinks.map(link => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + '/');

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50 shrink-0">
        <Button
          variant="ghost"
          asChild
          className="w-full justify-start text-muted-foreground hover:text-foreground gap-2 cursor-pointer"
        >
          <Link href="/">
            <ArrowRight className="size-4" />
            بازگشت به سایت
          </Link>
        </Button>
      </div>
    </>
  );

  return (
    <>
      <aside className="w-64 bg-card border-l border-border/50 h-screen sticky top-0 hidden lg:flex flex-col z-20">
        {SidebarContent}
      </aside>

      <div className="lg:hidden flex items-center justify-between bg-card border-b border-border/50 px-4 py-2 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="cursor-pointer">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-64 p-0 flex flex-col font-sans"
              aria-describedby={undefined}
              showCloseButton={false}
            >
              <SheetHeader className="sr-only">
                <SheetTitle>منوی مدیریت</SheetTitle>
              </SheetHeader>
              {SidebarContent}
            </SheetContent>
          </Sheet>
        </div>
        <Image
          src="/logo.svg"
          alt="varaq logo"
          className="size-12 md:size-16"
          width={64}
          height={64}
          loading="eager"
        />
        <ThemeToggle />
      </div>
    </>
  );
}
