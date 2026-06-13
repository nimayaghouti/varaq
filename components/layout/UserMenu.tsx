'use client';

import {
  LayoutDashboard,
  LogIn,
  LogOut,
  UserCircle,
  User as UserIcon,
  UserPlus,
} from 'lucide-react';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: 'ADMIN' | 'USER';
  } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  if (!user) {
    return (
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary cursor-pointer rounded-full"
          >
            <UserCircle className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 font-sans" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer gap-2">
              <Link href="/login" className="flex w-full items-center">
                <LogIn className="size-4 text-muted-foreground" />
                <span>ورود به حساب</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer gap-2">
              <Link href="/register" className="flex w-full items-center">
                <UserPlus className="size-4 text-muted-foreground" />
                <span>ثبت‌نام</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const displayName = user.name || user.email?.split('@')[0] || 'کاربر ورق';

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-8 rounded-full cursor-pointer"
        >
          <Avatar className="size-8 border border-border/50">
            <AvatarImage src={user.image || ''} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium uppercase">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 font-sans" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">
              {displayName}
            </p>
            <p
              className="text-xs leading-none text-muted-foreground truncate"
              dir="ltr"
              style={{ textAlign: 'right' }}
            >
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user.role === 'ADMIN' && (
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href="/admin/dashboard"
                className="flex w-full items-center gap-2"
              >
                <LayoutDashboard className="size-4 text-muted-foreground" />
                <span>داشبورد مدیریت</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/profile" className="flex w-full items-center gap-2">
              <UserIcon className="size-4 text-muted-foreground" />
              <span>پروفایل من</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer gap-2"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="size-4" />
          <span>خروج از حساب</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
