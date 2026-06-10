import { Library } from 'lucide-react';

import { Metadata } from 'next';
import Link from 'next/link';

import { FadeIn } from '@/components/shared/FadeIn';

import { getGenres } from '@/lib/data/client';

export const metadata: Metadata = {
  title: 'دسته‌بندی‌ها',
  description:
    'مرور کتاب‌ها بر اساس ژانر و دسته‌بندی موضوعی. رمان، روانشناسی، تاریخ، علمی-تخیلی و ده‌ها موضوع دیگر.',
};

export default async function GenresPage() {
  const genres = await getGenres();

  return (
    <div className="flex flex-col gap-12 pb-8">
      <div className="flex flex-col gap-2 bg-muted/30 p-8 rounded-2xl border border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Library className="size-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            دسته‌بندی موضوعی
          </h1>
        </div>
        <p className="text-muted-foreground">
          کتاب مورد علاقه خود را از میان {genres.length} ژانر مختلف پیدا کنید
        </p>
      </div>

      <FadeIn direction="up">
        {genres.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 px-4">
            {genres.map(genre => (
              <Link
                key={genre.id}
                href={`/genres/${genre.name}`}
                className="relative flex items-center justify-center aspect-square group"
              >
                <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-[58%_43%_33%_64%/50%_38%_53%_50%] transition-all duration-500 ease-in-out group-hover:rounded-[43%_58%_64%_33%/38%_50%_50%_53%] group-hover:scale-110 group-hover:bg-primary/20 dark:group-hover:bg-primary/30" />

                <div className="absolute inset-2 md:inset-4 bg-secondary/60 dark:bg-secondary/40 rounded-[43%_58%_64%_33%/38%_50%_50%_53%] transition-all duration-500 ease-in-out group-hover:rounded-[58%_43%_33%_64%/50%_38%_53%_50%] group-hover:-rotate-12 opacity-80 backdrop-blur-sm" />

                <h3 className="relative z-10 text-lg md:text-xl font-bold text-foreground transition-all duration-300 group-hover:text-primary group-hover:scale-110 text-center drop-shadow-sm px-2">
                  {genre.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-border/50">
            هیچ دسته‌بندی یافت نشد.
          </div>
        )}
      </FadeIn>
    </div>
  );
}
