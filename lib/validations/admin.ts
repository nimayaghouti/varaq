import * as z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const BookFormSchema = z.object({
  title: z.string().min(2, { message: 'عنوان کتاب الزامی است' }),
  author: z.string().min(2, { message: 'نام نویسنده الزامی است' }),
  publication_year: z
    .string()
    .min(4, { message: 'سال انتشار باید معتبر باشد' }),
  description: z
    .string()
    .min(10, { message: 'توضیحات باید حداقل ۱۰ کاراکتر باشد' }),
  cover_image: z
    .any()
    .refine(
      file => file && (typeof file === 'string' || file instanceof File),
      'تصویر جلد الزامی است.',
    )
    .refine(
      file =>
        !file ||
        typeof file === 'string' ||
        (file instanceof File && file.size <= MAX_FILE_SIZE),
      'حداکثر حجم مجاز ۵ مگابایت است.',
    )
    .refine(
      file =>
        !file ||
        typeof file === 'string' ||
        (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
      'فقط فرمت‌های jpg, jpeg, png, webp مجاز هستند.',
    ),
  price: z
    .number({ message: 'قیمت معتبر نیست' })
    .min(1000, { message: 'قیمت باید بیشتر از ۱۰۰۰ تومان باشد' }),
  stock: z
    .number({ message: 'موجودی معتبر نیست' })
    .min(0, { message: 'موجودی نمی‌تواند منفی باشد' }),
  genres: z.string().min(2, { message: 'حداقل یک ژانر وارد کنید' }),
});
