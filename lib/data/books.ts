import { Book } from '@/types';

import { getBooks } from './client';

export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getBooks();

  return books.find(book => book.id.toString() === id);
}

export async function getSimilarBooks(
  currentBook: Book,
  limit = 5,
): Promise<Book[]> {
  const books = await getBooks();

  return books
    .filter(book => book.id !== currentBook.id)
    .filter(book => book.genre.some(g => currentBook.genre.includes(g)))
    .sort((a, b) => {
      const aMatches = a.genre.filter(g =>
        currentBook.genre.includes(g),
      ).length;
      const bMatches = b.genre.filter(g =>
        currentBook.genre.includes(g),
      ).length;
      return bMatches - aMatches;
    })
    .slice(0, limit);
}
