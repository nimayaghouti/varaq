'use client';

import { Eye, EyeOff, LogIn } from 'lucide-react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

import { CartItem } from '@/store/cart-store';

import { useCart } from '@/hooks';

import { googleLoginAction, loginAction } from '@/lib/actions/auth';
import { LoginSchema } from '@/lib/validations/auth';

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
    {},
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const { items, setCart } = useCart();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const clientValidation = LoginSchema.safeParse(data);
    if (!clientValidation.success) {
      setErrors(z.flattenError(clientValidation.error).fieldErrors);
      setLoading(false);
      return;
    }

    const localCart = items.map(i => ({ id: i.id, quantity: i.quantity }));

    try {
      const result = await loginAction(data, localCart);

      if (result?.error) {
        toast.error(result.error);
      } else {
        if (result.mergedCart) setCart(result.mergedCart as CartItem[]);

        toast.success(result?.success || 'با موفقیت وارد شدید');
        router.push(callbackUrl);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-lg w-full">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">ورود به حساب</CardTitle>
        <CardDescription>ایمیل و رمز عبور خود را وارد کنید</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              ایمیل
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              className="text-left"
              placeholder="name@example.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              رمز عبور
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                className="text-left pr-10"
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password[0]}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-2 hover:cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              'در حال بررسی...'
            ) : (
              <>
                <LogIn className="size-4 mr-2" /> ورود
              </>
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">یا</span>
          </div>
        </div>

        <form action={googleLoginAction}>
          <Button
            variant="outline"
            type="submit"
            className="w-full gap-2 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            ورود با گوگل
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-border/50 pt-6">
        <p className="text-sm text-muted-foreground">
          حساب کاربری ندارید؟{' '}
          <Link
            href="/register"
            className="text-primary font-bold hover:underline"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

function LoginSkeleton() {
  return (
    <Card className="border-border/50 shadow-lg w-full">
      <CardHeader className="text-center space-y-4 pt-8">
        <Skeleton className="h-8 w-1/2 mx-auto" />
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-6 mt-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
        <Skeleton className="h-10 w-full mt-8" />
      </CardContent>
      <CardFooter className="justify-center border-t border-border/50 pt-6 pb-6">
        <Skeleton className="h-4 w-2/3" />
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
