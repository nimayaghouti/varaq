import { ArrowRight, Library } from 'lucide-react';

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BookCard } from '@/components/shared/BookCard';
import { BookGrid } from '@/components/shared/BookGrid';
import { FadeIn } from '@/components/shared/FadeIn';
import { Button } from '@/components/ui/button';

import { getBooks, getGenres } from '@/lib/data/client';

type Props = {
  params: Promise<{ genre: string }>;
};

export async function generateStaticParams() {
  const genres = await getGenres();
  return genres.map(g => ({
    genre: g.name,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { genre } = await params;
  const decodedGenre = decodeURIComponent(genre);

  return {
    title: `کتاب‌های ${decodedGenre}`,
    description: `لیست بهترین کتاب‌ها در دسته‌بندی و ژانر ${decodedGenre} در کتابفروشی ورق.`,
  };
}

export default async function GenreFilterPage({ params }: Props) {
  const { genre } = await params;
  const decodedGenre = decodeURIComponent(genre);

  const genres = await getGenres();
  const genreExists = genres.some(g => g.name === decodedGenre);

  if (!genreExists) {
    notFound();
  }

  const books = await getBooks();
  const filteredBooks = books.filter(book => book.genre.includes(decodedGenre));

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col gap-4 bg-muted/30 p-8 rounded-2xl border border-border/50">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="w-fit text-muted-foreground hover:text-primary mb-2 -ml-2"
        >
          <Link href="/genres">
            <ArrowRight className="ml-2 size-4" /> بازگشت به دسته‌بندی‌ها
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Library className="size-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            کتاب‌های {decodedGenre}
          </h1>
        </div>
        <p className="text-muted-foreground font-medium">
          {filteredBooks.length} کتاب در این دسته‌بندی پیدا شد
        </p>
      </div>

      <FadeIn direction="up">
        {filteredBooks.length > 0 ? (
          <BookGrid>
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </BookGrid>
        ) : (
          <div className="text-center py-20 flex flex-col gap-4 items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-border/50">
            <Library className="size-12 opacity-20" />
            <p>متأسفانه هنوز کتابی در این دسته‌بندی اضافه نشده است.</p>
          </div>
        )}
      </FadeIn>
    </div>
  );
}
