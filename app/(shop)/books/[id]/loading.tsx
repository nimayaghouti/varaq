import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookDetailsLoading() {
  return (
    <div className="flex flex-col pb-8">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
          <Skeleton className="aspect-2/3 w-full max-w-sm mx-auto md:max-w-none rounded-xl" />
        </div>

        <div className="flex flex-col flex-1 gap-6 w-full mt-4 md:mt-0">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
          </div>

          <div className="flex gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          <Separator className="my-2" />

          <div className="space-y-3">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="mt-auto pt-6 flex gap-4 items-center">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-12 w-48 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
