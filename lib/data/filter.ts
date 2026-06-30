import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import { Book } from '@/types';

export interface FilterParams {
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  genres?: string[];
  inStock?: boolean;
}

const parseYearForSorting = (yearStr: string): number => {
  if (!yearStr) return 0;
  if (yearStr.includes('قبل از میلاد')) {
    const match = yearStr.match(/\d+/);
    if (match) return -parseInt(match[0]);
    return -9999;
  }

  const parsed = parseInt(yearStr);
  return isNaN(parsed) ? 0 : parsed;
};

export async function getFilteredBooks(params: FilterParams): Promise<Book[]> {
  const where: Prisma.BookWhereInput = {};

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    where.price = {};
    if (params.minPrice !== undefined) where.price.gte = params.minPrice;
    if (params.maxPrice !== undefined) where.price.lte = params.maxPrice;
  }

  if (params.genres && params.genres.length > 0) {
    where.genres = { hasSome: params.genres };
  }

  if (params.inStock) {
    where.stock = { gt: 0 };
  }

  let orderBy: Prisma.BookOrderByWithRelationInput = { createdAt: 'desc' };

  if (params.sort) {
    switch (params.sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'title_asc':
        orderBy = { title: 'asc' };
        break;
      default:
        break;
    }
  }

  const books = await prisma.book.findMany({
    where,
    orderBy,
  });

  return books.sort((a, b) => {
    const aInStock = a.stock > 0 ? 1 : 0;
    const bInStock = b.stock > 0 ? 1 : 0;

    if (aInStock !== bInStock) {
      return bInStock - aInStock;
    }

    if (params.sort === 'year_desc') {
      return (
        parseYearForSorting(b.publication_year) -
        parseYearForSorting(a.publication_year)
      );
    }
    if (params.sort === 'year_asc') {
      return (
        parseYearForSorting(a.publication_year) -
        parseYearForSorting(b.publication_year)
      );
    }

    return 0;
  });
}
