'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod';

import { auth, unstable_update } from '@/auth';

import { prisma } from '@/lib/prisma';
import { ProfileFormSchema } from '@/lib/validations/user';

export async function updateProfileAction(
  values: z.infer<typeof ProfileFormSchema>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'شما دسترسی لازم را ندارید.' };
    }

    const validatedFields = ProfileFormSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: 'داده‌های وارد شده نامعتبر است.' };
    }

    const { name, image } = validatedFields.data;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || null,
        image: image || null,
      },
    });

    await unstable_update({
      user: {
        name: name || null,
        image: image || null,
      },
    });

    revalidatePath('/profile');
    revalidatePath('/');

    return { success: 'اطلاعات پروفایل با موفقیت بروزرسانی شد.' };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در بروزرسانی اطلاعات رخ داد.' };
  }
}
