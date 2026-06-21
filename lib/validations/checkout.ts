import * as z from 'zod';

export const CheckoutSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'نام گیرنده باید حداقل ۳ کاراکتر باشد' }),
  phone: z.string().regex(/^09\d{9}$/, {
    message: 'شماره موبایل نامعتبر است (مثال: 09123456789)',
  }),
  address: z.string().min(10, { message: 'لطفاً آدرس دقیق پستی را وارد کنید' }),
});
