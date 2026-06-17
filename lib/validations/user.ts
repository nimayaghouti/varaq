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
