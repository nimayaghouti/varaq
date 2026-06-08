import { Search as SearchIcon } from 'lucide-react';

import { Metadata } from 'next';

import { BookCard } from '@/components/shared/BookCard';
import { BookGrid } from '@/components/shared/BookGrid';
import { SearchBar } from '@/components/shared/SearchBar';

import { searchBooks } from '@/lib/data/search';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: 'جستجوی کتاب',
  description: 'جستجوی هوشمند در بین تمام کتاب‌های کتابفروشی ورق.',
};

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';

  const results = await searchBooks(q);

  return (
    <div className="flex flex-col gap-10 pb-8">
      <div className="flex flex-col items-center justify-center gap-6 bg-muted/30 p-8 md:p-12 rounded-3xl border border-border/50 text-center">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <SearchIcon className="size-8 text-primary" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            جستجوی پیشرفته
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            به دنبال چه کتابی هستید؟
          </p>
        </div>

        <div className="w-full mt-4">
          <SearchBar />
        </div>
      </div>

      <div className="flex flex-col gap-6 px-2">
        {q ? (
          <>
            <h2 className="text-xl font-bold tracking-tight flex flex-wrap items-center gap-2">
              نتایج برای: <span className="text-primary">&quot;{q}&quot;</span>
              <span className="text-sm font-normal text-muted-foreground mr-auto">
                ({results.length} کتاب یافت شد)
              </span>
            </h2>

            {results.length > 0 ? (
              <BookGrid>
                {results.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </BookGrid>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border border-border/50 flex flex-col items-center gap-4">
                <SearchIcon className="size-12 text-muted-foreground/30" />
                <p className="text-lg text-muted-foreground">
                  کتابی با این مشخصات پیدا نشد. لطفاً عبارت دیگری را امتحان
                  کنید.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            برای شروع جستجو، عبارتی را در کادر بالا وارد نمایید.
          </div>
        )}
      </div>
    </div>
  );
}
