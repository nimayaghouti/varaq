'use client';

import { Save } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Book } from '@prisma/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { createBookAction, updateBookAction } from '@/lib/actions/admin-books';
import { BookFormSchema } from '@/lib/validations/admin';

type FormData = z.infer<typeof BookFormSchema>;

interface BookFormProps {
  initialData?: Book;
  onSuccess: () => void;
}

export function BookForm({ initialData, onSuccess }: BookFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(BookFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          genres: initialData.genres.join(', '),
        }
      : {
          title: '',
          author: '',
          publication_year: '',
          description: '',
          cover_image: '',
          price: 0,
          stock: 10,
          genres: '',
        },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = initialData
        ? await updateBookAction(initialData.id, data)
        : await createBookAction(data);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.success);
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">عنوان کتاب</Label>
        <Input id="title" {...register('title')} className="bg-background" />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author">نویسنده</Label>
          <Input
            id="author"
            {...register('author')}
            className="bg-background"
          />
          {errors.author && (
            <p className="text-xs text-destructive">{errors.author.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="publication_year">سال انتشار</Label>
          <Input
            id="publication_year"
            {...register('publication_year')}
            className="bg-background"
            dir="ltr"
          />
          {errors.publication_year && (
            <p className="text-xs text-destructive">
              {errors.publication_year.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">قیمت (تومان)</Label>
          <Input
            id="price"
            type="number"
            {...register('price', { valueAsNumber: true })}
            className="bg-background"
            dir="ltr"
          />
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">موجودی انبار</Label>
          <Input
            id="stock"
            type="number"
            {...register('stock', { valueAsNumber: true })}
            className="bg-background"
            dir="ltr"
          />
          {errors.stock && (
            <p className="text-xs text-destructive">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="genres">ژانرها (با ویرگول جدا کنید)</Label>
        <Input
          id="genres"
          {...register('genres')}
          className="bg-background"
          placeholder="رمان, تاریخی"
        />
        {errors.genres && (
          <p className="text-xs text-destructive">{errors.genres.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover_image">لینک تصویر جلد</Label>
        <Input
          id="cover_image"
          {...register('cover_image')}
          className="bg-background text-left"
          dir="ltr"
          placeholder="https://..."
        />
        {errors.cover_image && (
          <p className="text-xs text-destructive">
            {errors.cover_image.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">توضیحات</Label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 items-center gap-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={loading}
          className=" cursor-pointer"
        >
          انصراف
        </Button>
        <Button type="submit" disabled={loading} className=" cursor-pointer">
          {loading ? (
            'در حال ذخیره...'
          ) : (
            <>
              <Save className="size-4 ml-2" /> ذخیره اطلاعات کتاب
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
