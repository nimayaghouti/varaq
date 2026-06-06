import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingCard() {
  return (
    <Card className="overflow-hidden flex flex-col h-full border-border/50 shadow-sm">
      <Skeleton className="h-70 w-full rounded-none" />

      <CardHeader className="p-4 pb-2 gap-2">
        <Skeleton className="h-5 w-4/5" />

        <Skeleton className="h-4 w-3/5" />
      </CardHeader>

      <CardContent className="p-4 pt-0 mt-auto">
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Skeleton className="h-6 w-20" />

        <Skeleton className="h-9 w-20 rounded-md" />
      </CardFooter>
    </Card>
  );
}
