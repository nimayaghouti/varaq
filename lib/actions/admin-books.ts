'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod';

import { auth } from '@/auth';

import { prisma } from '@/lib/prisma';
import { BookFormSchema } from '@/lib/validations/admin';

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('دسترسی غیرمجاز');
  }
}

export async function createBookAction(values: z.infer<typeof BookFormSchema>) {
  try {
    await checkAdmin();
    const validatedFields = BookFormSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: 'داده‌های وارد شده نامعتبر است' };
    }

    const data = validatedFields.data;

    const genresArray = data.genres
      .split(',')
      .map(g => g.trim())
      .filter(Boolean);

    await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        publication_year: data.publication_year,
        description: data.description,
        cover_image: data.cover_image,
        price: data.price,
        stock: data.stock,
        genres: genresArray,
      },
    });

    revalidatePath('/admin/books');
    revalidatePath('/books');
    revalidatePath('/');

    return { success: 'کتاب با موفقیت اضافه شد' };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در ثبت کتاب رخ داد' };
  }
}

export async function updateBookAction(
  id: string,
  values: z.infer<typeof BookFormSchema>,
) {
  try {
    await checkAdmin();
    const validatedFields = BookFormSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: 'داده‌های وارد شده نامعتبر است' };
    }

    const data = validatedFields.data;
    const genresArray = data.genres
      .split(',')
      .map(g => g.trim())
      .filter(Boolean);

    await prisma.book.update({
      where: { id },
      data: {
        title: data.title,
        author: data.author,
        publication_year: data.publication_year,
        description: data.description,
        cover_image: data.cover_image,
        price: data.price,
        stock: data.stock,
        genres: genresArray,
      },
    });

    revalidatePath('/admin/books');
    revalidatePath('/books');
    revalidatePath(`/books/${id}`);

    return { success: 'اطلاعات کتاب بروزرسانی شد' };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در بروزرسانی رخ داد' };
  }
}

export async function deleteBookAction(id: string) {
  try {
    await checkAdmin();

    await prisma.book.delete({
      where: { id },
    });

    revalidatePath('/admin/books');
    revalidatePath('/books');
    revalidatePath('/');

    return { success: 'کتاب با موفقیت حذف شد' };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در حذف کتاب رخ داد' };
  }
}
