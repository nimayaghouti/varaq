'use client';

import { Filter, SlidersHorizontal, X } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';

import { formatPrice } from '@/lib/format';
import { Genre } from '@/types';

interface FilterSidebarProps {
  genres: Genre[];
}

export function FilterSidebar({ genres }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || '';
  const currentMinPrice = Number(searchParams.get('minPrice')) || 0;
  const currentMaxPrice = Number(searchParams.get('maxPrice')) || 5000000;
  const currentGenres = searchParams.get('genres')?.split(',') || [];

  const [priceRange, setPriceRange] = useState([
    currentMinPrice,
    currentMaxPrice,
  ]);
  const [prevUrlPrices, setPrevUrlPrices] = useState([
    currentMinPrice,
    currentMaxPrice,
  ]);

  if (
    currentMinPrice !== prevUrlPrices[0] ||
    currentMaxPrice !== prevUrlPrices[1]
  ) {
    setPrevUrlPrices([currentMinPrice, currentMaxPrice]);
    setPriceRange([currentMinPrice, currentMaxPrice]);
  }

  const handlePriceCommit = (val: number[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (val[0] > 0) {
      params.set('minPrice', val[0].toString());
    } else {
      params.delete('minPrice');
    }

    if (val[1] < 5000000) {
      params.set('maxPrice', val[1].toString());
    } else {
      params.delete('maxPrice');
    }

    router.push(`/books?${params.toString()}`, { scroll: false });
  };

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/books?${params.toString()}`, { scroll: false });
  };

  const toggleGenre = (genreName: string, checked: boolean) => {
    let updatedGenres = [...currentGenres];
    if (checked) {
      updatedGenres.push(genreName);
    } else {
      updatedGenres = updatedGenres.filter(g => g !== genreName);
    }
    updateFilters(
      'genres',
      updatedGenres.length > 0 ? updatedGenres.join(',') : null,
    );
  };

  const clearFilters = () => {
    router.push(`/books`, { scroll: false });
  };

  const FiltersContent = (
    <div className="flex flex-col gap-8 pb-6 px-2">
      {(currentSort ||
        currentMinPrice > 0 ||
        currentMaxPrice < 5000000 ||
        currentGenres.length > 0) && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive w-fit ml-auto cursor-pointer"
        >
          <X className="size-4 ml-2" />
          پاک کردن فیلترها
        </Button>
      )}

      <div className="space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          مرتب‌سازی
        </h3>
        <Select
          dir="rtl"
          value={currentSort}
          onValueChange={val => updateFilters('sort', val)}
        >
          <SelectTrigger className="w-full bg-background cursor-pointer">
            <SelectValue placeholder="پیش‌فرض" />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectItem value="default" className="cursor-pointer">
              پیش‌فرض
            </SelectItem>
            <SelectItem value="price_asc" className="cursor-pointer">
              ارزان‌ترین
            </SelectItem>
            <SelectItem value="price_desc" className="cursor-pointer">
              گران‌ترین
            </SelectItem>
            <SelectItem value="year_desc" className="cursor-pointer">
              جدیدترین
            </SelectItem>
            <SelectItem value="year_asc" className="cursor-pointer">
              قدیمی‌ترین
            </SelectItem>
            <SelectItem value="title_asc" className="cursor-pointer">
              به ترتیب الفبا
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-6">
        <h3 className="font-bold">محدوده قیمت</h3>
        <Slider
          dir="rtl"
          min={0}
          max={5000000}
          step={50000}
          value={priceRange}
          onValueChange={setPriceRange}
          onValueCommit={handlePriceCommit}
          className="py-4 cursor-pointer"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground font-medium">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-bold">ژانرها</h3>
        <div className="flex flex-col gap-3">
          {genres.map(genre => (
            <div key={genre.id} className="flex items-center ps-1 gap-2">
              <Checkbox
                id={`genre-${genre.id}`}
                checked={currentGenres.includes(genre.name)}
                onCheckedChange={checked =>
                  toggleGenre(genre.name, checked as boolean)
                }
              />
              <Label
                htmlFor={`genre-${genre.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
              >
                {genre.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-72 shrink-0 sticky top-24 bg-card border border-border/50 rounded-2xl pt-6 pl-2 shadow-sm overflow-hidden h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-2 mb-6 px-6 text-xl font-bold shrink-0">
          <Filter className="size-5 text-primary" />
          <h2>فیلترها</h2>
        </div>
        <ScrollArea dir="rtl" className="h-[calc(100%-4rem)] px-2">
          {FiltersContent}
        </ScrollArea>
      </div>

      <div className="lg:hidden w-full mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 rounded-xl bg-card cursor-pointer"
            >
              <Filter className="size-4" />
              فیلتر و مرتب‌سازی
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[85vh]! rounded-t-3xl pt-6 px-0 flex flex-col"
          >
            <SheetHeader className="mb-4 px-6 text-right shrink-0">
              <SheetTitle className="flex items-center gap-2">
                <Filter className="size-5 text-primary" />
                فیلترها
              </SheetTitle>
            </SheetHeader>
            <ScrollArea dir="rtl" className="h-[calc(100%-8rem)] flex-1 px-6">
              {FiltersContent}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
