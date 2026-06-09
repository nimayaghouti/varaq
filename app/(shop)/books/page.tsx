import { BookOpen, Frown } from 'lucide-react';

import { Metadata } from 'next';

import { BookCard } from '@/components/shared/BookCard';
import { BookGrid } from '@/components/shared/BookGrid';
import { FilterSidebar } from '@/components/shared/FilterSidebar';

import { getGenres } from '@/lib/data/client';
import { FilterParams, getFilteredBooks } from '@/lib/data/filter';

export const metadata: Metadata = {
  title: 'فروشگاه کتاب',
  description:
    'لیست کامل کتاب‌های موجود در کتابفروشی ورق. جستجو، بررسی و خرید آنلاین انواع کتاب با بهترین قیمت.',
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BooksPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;

  const filters: FilterParams = {
    sort:
      typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined,
    minPrice: resolvedParams.minPrice
      ? Number(resolvedParams.minPrice)
      : undefined,
    maxPrice: resolvedParams.maxPrice
      ? Number(resolvedParams.maxPrice)
      : undefined,
    genres:
      typeof resolvedParams.genres === 'string'
        ? resolvedParams.genres.split(',')
        : undefined,
  };

  const [books, genres] = await Promise.all([
    getFilteredBooks(filters),
    getGenres(),
  ]);

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
          گشت و گذار در میان صدها عنوان کتاب جذاب و خواندنی
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterSidebar genres={genres} />

        <div className="flex-1 w-full">
          <div className="mb-4 text-sm text-muted-foreground">
            {books.length} کتاب یافت شد
          </div>

          {books.length > 0 ? (
            <BookGrid layout="compact">
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </BookGrid>
          ) : (
            <div className="text-center py-20 flex flex-col items-center gap-4 text-muted-foreground bg-muted/20 rounded-2xl border border-border/50">
              <Frown className="size-12 opacity-20" />
              <p className="text-lg">
                متأسفانه با این فیلترها هیچ کتابی پیدا نشد.
              </p>
              <p className="text-sm">
                لطفاً فیلترهای خود را تغییر دهید یا پاک کنید.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
