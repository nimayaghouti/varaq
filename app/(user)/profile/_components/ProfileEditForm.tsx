'use client';

import { Save } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { EditableSection } from '@/components/shared/EditableSection';
import { ImageUpload } from '@/components/shared/ImageUpload';
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

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: user.name || '',
      image: user.image || '',
    },
  });

  const currentImage = useWatch({ control, name: 'image' });

  const onSubmit = async (data: FormData, close: () => void) => {
    setLoading(true);
    try {
      const result = await updateProfileAction(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.success);
        close();
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditableSection
      title="نام و آواتار"
      description="نام نمایشی و تصویر پروفایل شما."
      summary={
        <p className="text-sm font-medium">
          {user.name || 'نام تنظیم نشده است'}
        </p>
      }
    >
      {close => (
        <form
          onSubmit={handleSubmit(data => onSubmit(data, close))}
          className="space-y-4"
        >
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
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>تصویر پروفایل</Label>
              <ImageUpload
                value={currentImage}
                disabled={loading}
                aspectRatio={1}
                cropVariant="square"
                onChange={file =>
                  setValue('image', file, { shouldValidate: true })
                }
              />
              {errors.image && (
                <p className="text-xs text-destructive">
                  {errors.image.message as string}
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
                <Save className="size-4 ml-2" /> ذخیره تغییرات
              </>
            )}
          </Button>
        </form>
      )}
    </EditableSection>
  );
}
