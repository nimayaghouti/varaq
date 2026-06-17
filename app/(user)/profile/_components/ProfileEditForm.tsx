'use client';

import { Save } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { updateProfileAction } from '@/lib/actions/user';
import { ProfileFormSchema } from '@/lib/validations/user';

type FormData = z.infer<typeof ProfileFormSchema>;

interface ProfileEditFormProps {
  user: {
    name: string | null;
    image: string | null;
  };
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: user.name || '',
      image: user.image || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await updateProfileAction(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.success);
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">نام و نام خانوادگی</Label>
          <Input
            id="name"
            {...register('name')}
            className="bg-background"
            placeholder="نام خود را وارد کنید"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">لینک آواتار (تصویر پروفایل)</Label>
          <Input
            id="image"
            {...register('image')}
            className="bg-background text-left"
            dir="ltr"
            placeholder="https://..."
          />
          {errors.image && (
            <p className="text-xs text-destructive">{errors.image.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto cursor-pointer rounded-xl"
      >
        {loading ? (
          'در حال ذخیره...'
        ) : (
          <>
            <Save className="size-4 ml-2" /> ذخیره تغییرات
          </>
        )}
      </Button>
    </form>
  );
}
