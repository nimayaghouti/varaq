'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod';

import { auth } from '@/auth';

import { prisma } from '@/lib/prisma';
import { ReviewSchema } from '@/lib/validations/review';

export async function addReviewAction(values: z.infer<typeof ReviewSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'برای ثبت نظر باید وارد حساب کاربری خود شوید.' };
    }

    const validatedFields = ReviewSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: 'داده‌های وارد شده معتبر نیستند.' };
    }

    const { bookId, rating, text } = validatedFields.data;

    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        bookId: bookId,
      },
    });

    if (existingReview) {
      return { error: 'شما قبلاً برای این کتاب نظر خود را ثبت کرده‌اید!' };
    }

    await prisma.review.create({
      data: {
        userId: session.user.id,
        bookId,
        rating,
        text,
      },
    });

    revalidatePath(`/books/${bookId}`);
    revalidatePath('/profile');

    return { success: 'نظر شما با موفقیت ثبت شد.' };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در ثبت نظر رخ داد.' };
  }
}
