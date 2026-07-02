'use client';

import { Save } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { EditableSection } from '@/components/shared/EditableSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { updateEmailAction } from '@/lib/actions/user';
import { ChangeEmailSchema } from '@/lib/validations/user';

type FormData = z.infer<typeof ChangeEmailSchema>;

interface ChangeEmailFormProps {
  currentEmail: string;
  hasPassword: boolean;
}

export function ChangeEmailForm({
  currentEmail,
  hasPassword,
}: ChangeEmailFormProps) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormData, close: () => void) => {
    setLoading(true);
    try {
      const result = await updateEmailAction(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.success);
        reset();
        close();
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditableSection
      title="آدرس ایمیل (شناسه کاربری)"
      description="این ایمیل برای ورود به حساب شما استفاده می‌شود."
      summary={
        <p
          className="font-medium bg-background inline-block px-3 py-1 rounded-lg border border-border/50 text-sm"
          dir="ltr"
        >
          {currentEmail}
        </p>
      }
      disabled={!hasPassword}
      disabledMessage="شما با حساب گوگل وارد شده‌اید، تغییر ایمیل از این طریق امکان‌پذیر نیست."
    >
      {close => (
        <form
          onSubmit={handleSubmit(data => onSubmit(data, close))}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل جدید</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                className="bg-background text-left"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-password">رمز عبور</Label>
              <Input
                id="email-password"
                type="password"
                dir="ltr"
                className="bg-background text-left"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="sm"
            className="rounded-xl cursor-pointer"
          >
            {loading ? (
              'در حال ذخیره...'
            ) : (
              <>
                <Save className="size-4 ml-2" /> ذخیره ایمیل جدید
              </>
            )}
          </Button>
        </form>
      )}
    </EditableSection>
  );
}
