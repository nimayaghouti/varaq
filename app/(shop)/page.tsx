import { ArrowLeft, Sparkles } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import { BookCard } from '@/components/shared/BookCard';
import { BookGrid } from '@/components/shared/BookGrid';
import { Button } from '@/components/ui/button';

import { getBooks } from '@/lib/data/client';

export default async function HomePage() {
  const books = await getBooks();

  const newArrivals = books.slice(0, 5);
  const popularBooks = books.slice(5, 10);

  return (
    <div className="flex flex-col gap-12 pb-8">
      <section className="relative overflow-hidden rounded-3xl bg-primary/5 px-6 py-12 md:px-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12 border border-primary/10">
        <div className="relative z-10 flex flex-col gap-6 max-w-2xl text-center md:text-right flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary w-fit mx-auto md:mx-0">
            <Sparkles className="size-4" />
            <span>جشنواره تابستانه ورق</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            دنیای بی‌پایان <span className="text-primary">کتاب‌ها</span> در
            دستان شما
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            با مجموعه بی‌نظیر ما از پرفروش‌ترین رمان‌ها تا کتاب‌های تخصصی، لذت
            خواندن را دوباره کشف کنید. بررسی، انتخاب و خرید با چند کلیک.
          </p>

          <div className="flex items-center flex-wrap justify-center md:justify-start gap-4 pt-4">
            <Button size="lg" asChild className="font-bold rounded-xl px-8">
              <Link href="/books">فروشگاه کتاب</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-xl px-8 bg-background/50 backdrop-blur"
            >
              <Link href="/genres">دسته‌بندی‌ها</Link>
            </Button>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center w-full max-w-xs md:max-w-sm lg:max-w-md drop-shadow-2xl hover:scale-105 transition-transform duration-700">
          <Image
            src="/logo.svg"
            alt="لوگوی کتابفروشی ورق"
            width={400}
            height={400}
            priority
            className="w-full h-auto object-contain"
          />
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            تازه‌های نشر
          </h2>
          <Button
            variant="ghost"
            className="group text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href="/books">
              مشاهده همه
              <ArrowLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>

        {newArrivals.length > 0 ? (
          <BookGrid>
            {newArrivals.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </BookGrid>
        ) : (
          <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-xl">
            هیچ کتابی یافت نشد.
          </div>
        )}
      </section>

      <section className="flex flex-col gap-6 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            پرفروش‌ترین‌ها
          </h2>
          <Button
            variant="ghost"
            className="group text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href="/books">
              مشاهده همه
              <ArrowLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>

        {popularBooks.length > 0 ? (
          <BookGrid>
            {popularBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </BookGrid>
        ) : (
          <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-xl">
            هیچ کتابی یافت نشد.
          </div>
        )}
      </section>
    </div>
  );
}
