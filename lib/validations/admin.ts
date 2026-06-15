import * as z from 'zod';

export const BookFormSchema = z.object({
  title: z.string().min(2, { message: 'عنوان کتاب الزامی است' }),
  author: z.string().min(2, { message: 'نام نویسنده الزامی است' }),
  publication_year: z
    .string()
    .min(4, { message: 'سال انتشار باید معتبر باشد' }),
  description: z
    .string()
    .min(10, { message: 'توضیحات باید حداقل ۱۰ کاراکتر باشد' }),
  cover_image: z.url({ message: 'لینک تصویر معتبر نیست' }),
  price: z
    .number({ message: 'قیمت معتبر نیست' })
    .min(1000, { message: 'قیمت باید بیشتر از ۱۰۰۰ تومان باشد' }),
  stock: z
    .number({ message: 'موجودی معتبر نیست' })
    .min(0, { message: 'موجودی نمی‌تواند منفی باشد' }),
  genres: z.string().min(2, { message: 'حداقل یک ژانر وارد کنید' }),
});
