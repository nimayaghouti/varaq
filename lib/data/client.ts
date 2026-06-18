import { unstable_cache } from 'next/cache';

import { prisma } from '@/lib/prisma';

import { Book, Genre } from '@/types';

export const getBooks = unstable_cache(
  async (): Promise<Book[]> => {
    return prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },
  ['all-books'],
  {
    revalidate: 3600,
    tags: ['books'],
  },
);

export const getGenres = unstable_cache(
  async (): Promise<Genre[]> => {
    return prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });
  },
  ['all-genres'],
  {
    revalidate: 86400,
    tags: ['genres'],
  },
);
