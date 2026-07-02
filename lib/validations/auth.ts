import * as z from 'zod';

export const CoreAuthSchema = z.object({
  email: z.email({ message: 'ایمیل نامعتبر است' }),
  password: z.string().min(1, { message: 'رمز عبور الزامی است' }),
});

export const LoginSchema = CoreAuthSchema.extend({
  altcha: z.string().min(1, { message: 'تایید کپچا الزامی است' }),
});

export const RegisterSchema = z
  .object({
    email: z.email({ message: 'ایمیل نامعتبر است' }),
    password: z
      .string()
      .min(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
        message: 'رمز عبور باید ترکیبی از حروف انگلیسی و اعداد باشد',
      }),
    confirmPassword: z.string(),
    altcha: z.string().min(1, { message: 'تایید کپچا الزامی است' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'رمز عبور و تکرار آن یکسان نیستند',
    path: ['confirmPassword'],
  });
