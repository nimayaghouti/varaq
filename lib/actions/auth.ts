'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import * as z from 'zod';

import { signIn } from '@/auth';

import { prisma } from '@/lib/prisma';
import { LoginSchema, RegisterSchema } from '@/lib/validations/auth';

export async function registerAction(values: z.infer<typeof RegisterSchema>) {
  try {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: 'اطلاعات وارد شده نامعتبر است!' };
    }

    const { email, password, name } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'این ایمیل قبلاً در سیستم ثبت شده است!' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: 'ثبت‌نام با موفقیت انجام شد! حالا می‌توانید وارد شوید.' };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در سمت سرور رخ داد!' };
  }
}

export async function loginAction(values: z.infer<typeof LoginSchema>) {
  try {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: 'اطلاعات وارد شده نامعتبر است!' };
    }

    const { email, password } = validatedFields.data;

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: 'با موفقیت وارد شدید!' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'ایمیل یا رمز عبور اشتباه است!' };
        default:
          return { error: 'خطایی در ورود رخ داد!' };
      }
    }
    throw error;
  }
}
