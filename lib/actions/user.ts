'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

import { auth, unstable_update } from '@/auth';

import { prisma } from '@/lib/prisma';
import {
  ChangeEmailSchema,
  ChangePasswordSchema,
  ProfileFormSchema,
} from '@/lib/validations/user';

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

export async function updateEmailAction(
  values: z.infer<typeof ChangeEmailSchema>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'شما دسترسی لازم را ندارید.' };
    }

    const validatedFields = ChangeEmailSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: 'داده‌های وارد شده نامعتبر است.' };
    }

    const { email, password } = validatedFields.data;

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser?.password) {
      return { error: 'امکان تغییر ایمیل برای این حساب وجود ندارد.' };
    }

    const passwordsMatch = await bcrypt.compare(password, currentUser.password);
    if (!passwordsMatch) {
      return { error: 'رمز عبور وارد شده صحیح نیست.' };
    }

    if (email === currentUser.email) {
      return { error: 'ایمیل جدید با ایمیل فعلی یکسان است.' };
    }

    const emailTaken = await prisma.user.findUnique({ where: { email } });
    if (emailTaken) {
      return { error: 'این ایمیل قبلاً توسط کاربر دیگری استفاده شده است.' };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { email, emailVerified: null },
    });

    await unstable_update({
      user: { email },
    });

    revalidatePath('/profile');

    return { success: 'ایمیل شما با موفقیت تغییر یافت.' };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در تغییر ایمیل رخ داد.' };
  }
}

export async function updatePasswordAction(
  values: z.infer<typeof ChangePasswordSchema>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'شما دسترسی لازم را ندارید.' };
    }

    const validatedFields = ChangePasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: 'داده‌های وارد شده نامعتبر است.' };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser?.password) {
      return { error: 'امکان تغییر رمز عبور برای این حساب وجود ندارد.' };
    }

    const passwordsMatch = await bcrypt.compare(
      currentPassword,
      currentUser.password,
    );
    if (!passwordsMatch) {
      return { error: 'رمز عبور فعلی صحیح نیست.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    revalidatePath('/profile');

    return { success: 'رمز عبور شما با موفقیت تغییر یافت.' };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در تغییر رمز عبور رخ داد.' };
  }
}
