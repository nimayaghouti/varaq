import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.email({ message: 'ایمیل نامعتبر است' }),
  password: z.string().min(1, { message: 'رمز عبور الزامی است' }),
});

export const RegisterSchema = z.object({
  name: z.string().min(3, { message: 'نام باید حداقل ۳ کاراکتر باشد' }),
  email: z.email({ message: 'ایمیل نامعتبر است' }),
  password: z
    .string()
    .min(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' }),
});
