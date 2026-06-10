import { BookGrid } from '@/components/shared/BookGrid';
import { LoadingCard } from '@/components/shared/LoadingCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function BooksLoading() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <Skeleton className="h-32 w-full rounded-2xl" />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Skeleton className="hidden lg:block w-72 h-[calc(100vh-8rem)] rounded-2xl shrink-0" />

        <div className="flex-1 w-full">
          <Skeleton className="h-5 w-24 mb-4" />
          <BookGrid layout="compact">
            {Array.from({ length: 12 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </BookGrid>
        </div>
      </div>
    </div>
  );
}
