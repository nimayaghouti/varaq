import { BookGrid } from '@/components/shared/BookGrid';
import { LoadingCard } from '@/components/shared/LoadingCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchLoading() {
  return (
    <div className="flex flex-col gap-10 pb-8">
      <Skeleton className="h-64 w-full rounded-3xl" />

      <div className="flex flex-col gap-6 px-2">
        <Skeleton className="h-8 w-64" />
        <BookGrid>
          {Array.from({ length: 10 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </BookGrid>
      </div>
    </div>
  );
}
