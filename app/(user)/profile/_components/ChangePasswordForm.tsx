'use client';

import { Eye, EyeOff, Save } from 'lucide-react';

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

import { updatePasswordAction } from '@/lib/actions/user';
import { ChangePasswordSchema } from '@/lib/validations/user';

type FormData = z.infer<typeof ChangePasswordSchema>;

interface ChangePasswordFormProps {
  hasPassword: boolean;
}

export function ChangePasswordForm({ hasPassword }: ChangePasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormData, close: () => void) => {
    setLoading(true);
    try {
      const result = await updatePasswordAction(data);
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
      title="رمز عبور"
      description="برای امنیت حساب، رمز عبور قوی انتخاب کنید."
      summary={
        <p
          className="font-medium bg-background inline-block px-3 py-1 rounded-lg border border-border/50 text-sm"
          dir="ltr"
        >
          ••••••••
        </p>
      }
      disabled={!hasPassword}
      disabledMessage="شما با حساب گوگل وارد شده‌اید، این حساب رمز عبور مجزایی ندارد."
    >
      {close => (
        <form
          onSubmit={handleSubmit(data => onSubmit(data, close))}
          className="space-y-4"
        >
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowPasswords(s => !s)}
              className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
            >
              {showPasswords ? (
                <EyeOff className="size-3.5" />
              ) : (
                <Eye className="size-3.5" />
              )}
              {showPasswords ? 'مخفی کردن رمزها' : 'نمایش رمزها'}
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
            <Input
              id="currentPassword"
              type={showPasswords ? 'text' : 'password'}
              dir="ltr"
              className="bg-background text-left"
              placeholder="••••••••"
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className="text-xs text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">رمز عبور جدید</Label>
              <Input
                id="newPassword"
                type={showPasswords ? 'text' : 'password'}
                dir="ltr"
                className="bg-background text-left"
                placeholder="••••••••"
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="text-xs text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تکرار رمز عبور جدید</Label>
              <Input
                id="confirmPassword"
                type={showPasswords ? 'text' : 'password'}
                dir="ltr"
                className="bg-background text-left"
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
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
                <Save className="size-4 ml-2" /> ذخیره رمز جدید
              </>
            )}
          </Button>
        </form>
      )}
    </EditableSection>
  );
}
