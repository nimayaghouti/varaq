import { BookCard } from '@/components/shared/BookCard';
import { BookGrid } from '@/components/shared/BookGrid';

import { Book } from '@/types';

interface SimilarBooksProps {
  books: Book[];
}

export function SimilarBooks({ books }: SimilarBooksProps) {
  return (
    <section className="flex flex-col gap-6 mt-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        کتاب‌های مشابه
      </h2>
      <BookGrid>
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </BookGrid>
    </section>
  );
}
