import * as z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const ProfileFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'نام باید حداقل ۳ کاراکتر باشد' })
    .optional()
    .or(z.literal('')),
  image: z
    .any()
    .optional()
    .refine(
      file => !file || typeof file === 'string' || file instanceof File,
      'فایل نامعتبر است.',
    )
    .refine(
      file =>
        !file ||
        typeof file === 'string' ||
        (file as File).size <= MAX_FILE_SIZE,
      'حداکثر حجم مجاز ۵ مگابایت است.',
    )
    .refine(
      file =>
        !file ||
        typeof file === 'string' ||
        ACCEPTED_IMAGE_TYPES.includes((file as File).type),
      'فقط فرمت‌های jpg, jpeg, png, webp مجاز هستند.',
    ),
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
