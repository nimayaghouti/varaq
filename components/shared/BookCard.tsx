import Link from 'next/link';

import { AddToCartButton } from '@/components/shared/AddToCartButton';
import { BookImage } from '@/components/shared/BookImage';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

import { formatPrice } from '@/lib/format';
import { Book } from '@/types';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const isOutOfStock = book.stock === 0;
  const isLowStock = book.stock > 0 && book.stock < 5;

  return (
    <Card className="group overflow-hidden flex flex-col h-full transition-all hover:shadow-md border-border/50 hover:border-primary/40 bg-card">
      <Link
        href={`/books/${book.id}`}
        className="block relative h-70 w-full overflow-hidden bg-muted"
      >
        <BookImage
          src={book.cover_image}
          alt={`جلد کتاب ${book.title}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {isLowStock && (
          <div className="absolute top-2 right-2 bg-orange-500/90 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-md z-10">
            {book.stock} عدد باقی مانده
          </div>
        )}
      </Link>

      <CardHeader className="p-4 pb-2">
        <Link href={`/books/${book.id}`}>
          <h3
            className="font-bold text-lg line-clamp-1 hover:text-primary transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>
        </Link>
        <p
          className="text-sm text-muted-foreground line-clamp-1"
          title={book.author}
        >
          {book.author}
        </p>
      </CardHeader>

      <CardContent className="p-4 pt-0 mt-auto">
        <div className="flex flex-wrap gap-1.5 mt-2">
          {book.genres.slice(0, 2).map(g => (
            <Badge
              key={g}
              variant="secondary"
              className="text-[10px] font-normal px-2 py-0.5"
            >
              {g}
            </Badge>
          ))}
          {book.genres.length > 2 && (
            <Badge
              variant="outline"
              className="text-[10px] font-normal px-1.5 py-0.5 text-muted-foreground border-border"
            >
              +{book.genres.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 flex justify-between items-center gap-2 border-t border-border/30 bg-muted/10 mt-auto">
        {isOutOfStock ? (
          <span className="font-bold text-muted-foreground/70 text-sm md:text-base whitespace-nowrap mx-auto">
            ناموجود
          </span>
        ) : (
          <>
            <span className="font-bold text-primary text-sm md:text-base whitespace-nowrap">
              {formatPrice(book.price)}
            </span>
            <AddToCartButton
              book={book}
              size="sm"
              variant="outline"
              className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary disabled:group-hover:bg-transparent disabled:group-hover:text-muted-foreground disabled:group-hover:border-border transition-colors cursor-pointer disabled:cursor-not-allowed"
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
}
