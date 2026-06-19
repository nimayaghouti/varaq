'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import * as z from 'zod';

import { signIn } from '@/auth';

import { mergeLocalCartWithDatabase } from '@/lib/actions/cart';
import { prisma } from '@/lib/prisma';
import { LoginSchema, RegisterSchema } from '@/lib/validations/auth';

export async function registerAction(
  values: z.infer<typeof RegisterSchema>,
  localCart: { id: string; quantity: number }[] = [],
) {
  try {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return { fieldErrors: z.flattenError(validatedFields.error).fieldErrors };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return {
        fieldErrors: { email: ['این ایمیل قبلاً در سیستم ثبت شده است!'] },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    const mergeResult = await mergeLocalCartWithDatabase(localCart, newUser.id);

    return {
      success: 'حساب شما ایجاد و وارد شدید!',
      mergedCart: mergeResult.success ? mergeResult.mergedCart : null,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'خطایی در ورود خودکار رخ داد. لطفاً دستی وارد شوید.' };
    }
    return { error: 'خطایی در سمت سرور رخ داد!' };
  }
}

export async function loginAction(
  values: z.infer<typeof LoginSchema>,
  localCart: { id: string; quantity: number }[] = [],
) {
  try {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: 'اطلاعات وارد شده نامعتبر است!' };
    }

    const { email, password } = validatedFields.data;
    const user = await prisma.user.findUnique({ where: { email } });

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    const mergeResult = await mergeLocalCartWithDatabase(localCart, user!.id);

    return {
      success: 'با موفقیت وارد شدید!',
      mergedCart: mergeResult.success ? mergeResult.mergedCart : null,
    };
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

export async function googleLoginAction() {
  await signIn('google', { redirectTo: '/' });
}
