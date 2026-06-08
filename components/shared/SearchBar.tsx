'use client';

import { Search as SearchIcon, X } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useDebounce } from '@/hooks';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (currentQ === debouncedQuery) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedQuery.trim() !== '') {
      params.set('q', debouncedQuery);
    } else {
      params.delete('q');
    }

    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, router, searchParams]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <SearchIcon className="absolute right-4 size-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="جستجو بر اساس نام کتاب، نویسنده یا ژانر..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-6 text-base md:text-lg rounded-2xl border-border/50 shadow-sm focus-visible:ring-primary/20 bg-card"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 hover:bg-transparent text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setQuery('')}
            aria-label="پاک کردن جستجو"
          >
            <X className="size-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
