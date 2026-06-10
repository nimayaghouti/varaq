import { BookOpen, Calendar, ShoppingBag, User } from 'lucide-react';

import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { AddToCartButton } from '@/components/shared/AddToCartButton';
import { FadeIn } from '@/components/shared/FadeIn';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { getBookById, getSimilarBooks } from '@/lib/data/books';
import { getBooks } from '@/lib/data/client';
import { formatPrice } from '@/lib/format';

import { SimilarBooks } from './_components/SimilarBooks';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const books = await getBooks();
  return books.map(book => ({
    id: book.id.toString(),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return { title: 'کتاب یافت نشد' };
  }

  return {
    title: book.title,
    description: book.description.substring(0, 160),
    openGraph: {
      images: [book.cover_image],
    },
  };
}

export default async function BookDetailsPage({ params }: Props) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  const similarBooks = await getSimilarBooks(book);

  return (
    <div className="flex flex-col pb-8">
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            <div className="relative aspect-2/3 w-full max-w-sm mx-auto md:max-w-none overflow-hidden rounded-xl border border-border/50 shadow-lg bg-muted">
              <Image
                src={book.cover_image}
                alt={`جلد کتاب ${book.title}`}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground font-medium">
                اثر {book.author}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                <span>سال انتشار: {book.publication_year}</span>
              </div>
              <Separator
                orientation="vertical"
                className="h-4 hidden sm:block"
              />
              <div className="flex items-center gap-1.5">
                <User className="size-4" />
                <span>نویسنده: {book.author}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {book.genre.map(g => (
                <Badge
                  key={g}
                  variant="secondary"
                  className="px-3 py-1 text-sm font-normal"
                >
                  {g}
                </Badge>
              ))}
            </div>

            <Separator className="my-2" />

            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                خلاصه کتاب
              </h2>
              <p className="text-muted-foreground leading-relaxed text-justify">
                {book.description}
              </p>
            </div>

            <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="text-2xl md:text-3xl font-bold text-primary whitespace-nowrap w-full sm:w-auto text-center sm:text-right">
                {formatPrice(book.price)}
              </div>
              <AddToCartButton
                book={book}
                size="lg"
                className="w-full sm:w-auto font-bold rounded-xl gap-2 cursor-pointer"
              >
                <ShoppingBag className="size-5" />
                افزودن به سبد خرید
              </AddToCartButton>
            </div>
          </div>
        </div>
      </FadeIn>

      {similarBooks.length > 0 && (
        <div className="mt-16">
          <Separator className="mb-8" />
          <SimilarBooks books={similarBooks} />
        </div>
      )}
    </div>
  );
}
