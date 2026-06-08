import { BookOpen } from 'lucide-react';

import { Metadata } from 'next';

import { BookCard } from '@/components/shared/BookCard';
import { BookGrid } from '@/components/shared/BookGrid';

import { getBooks } from '@/lib/data/client';

export const metadata: Metadata = {
  title: 'فروشگاه کتاب',
  description:
    'لیست کامل کتاب‌های موجود در کتابفروشی ورق. جستجو، بررسی و خرید آنلاین انواع کتاب با بهترین قیمت.',
};

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 bg-muted/30 p-8 rounded-2xl border border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <BookOpen className="size-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            فروشگاه کتاب
          </h1>
        </div>
        <p className="text-muted-foreground">
          گشت و گذار در میان {books.length} عنوان کتاب جذاب و خواندنی
        </p>
      </div>

      {books.length > 0 ? (
        <BookGrid>
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </BookGrid>
      ) : (
        <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-border/50">
          هیچ کتابی در فروشگاه یافت نشد.
        </div>
      )}
    </div>
  );
}
