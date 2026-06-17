import * as z from 'zod';

export const ReviewSchema = z.object({
  bookId: z.string(),
  rating: z.number().min(1, 'امتیاز الزامی است').max(5),
  text: z
    .string()
    .min(5, 'متن نظر باید حداقل ۵ کاراکتر باشد')
    .max(500, 'متن نظر طولانی‌تر از حد مجاز است'),
});
