import * as z from 'zod';

export const ProfileFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'نام باید حداقل ۳ کاراکتر باشد' })
    .optional()
    .or(z.literal('')),
  image: z
    .url({ message: 'لینک تصویر معتبر نیست' })
    .optional()
    .or(z.literal('')),
});

export const ChangeEmailSchema = z.object({
  email: z.email({ message: 'ایمیل معتبر نیست' }),
  password: z
    .string()
    .min(1, { message: 'وارد کردن رمز عبور فعلی الزامی است' }),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'وارد کردن رمز عبور فعلی الزامی است' }),
    newPassword: z
      .string()
      .min(8, { message: 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد' })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
        message: 'رمز عبور جدید باید ترکیبی از حروف انگلیسی و اعداد باشد',
      }),
    confirmPassword: z
      .string()
      .min(1, { message: 'تکرار رمز عبور جدید الزامی است' }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'رمز عبور جدید و تکرار آن یکسان نیستند',
    path: ['confirmPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: 'رمز عبور جدید نباید با رمز فعلی یکسان باشد',
    path: ['newPassword'],
  });
