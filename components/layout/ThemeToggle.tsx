'use client';

import { MonitorSmartphone, Moon, Sun } from 'lucide-react';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-primary cursor-pointer relative"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">تغییر تم</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="font-sans">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="cursor-pointer gap-2"
        >
          <Sun className="size-4" />
          <span>روشن</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="cursor-pointer gap-2"
        >
          <Moon className="size-4" />
          <span>تاریک</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="cursor-pointer gap-2"
        >
          <MonitorSmartphone className="size-4" />
          <span>سیستم</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
