import { prisma } from '@/lib/prisma';

import { Book } from '@/types';

export async function getBookById(id: string): Promise<Book | null> {
  if (!id || id.length !== 24) return null;

  return prisma.book.findUnique({
    where: { id },
  });
}

export async function getSimilarBooks(
  currentBook: Book,
  limit = 5,
): Promise<Book[]> {
  if (!currentBook.genres || currentBook.genres.length === 0) return [];

  return prisma.book.findMany({
    where: {
      id: { not: currentBook.id },
      genres: { hasSome: currentBook.genres },
    },
    take: limit,
  });
}
