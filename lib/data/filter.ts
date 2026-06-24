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
      case 'year_desc':
        orderBy = { publication_year: 'desc' };
        break;
      case 'year_asc':
        orderBy = { publication_year: 'asc' };
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
    return bInStock - aInStock;
  });
}
