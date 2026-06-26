'use server';

import Fuse from 'fuse.js';

import { Book } from '@/types';

import { getBooks } from './client';

export async function searchBooks(query: string): Promise<Book[]> {
  const books = await getBooks();

  if (!query || query.trim() === '') {
    return [];
  }

  const fuse = new Fuse(books, {
    keys: ['title', 'author', 'genres'],
    threshold: 0.3,
    ignoreLocation: true,
  });

  const results = fuse.search(query);

  return results
    .map(result => result.item)
    .sort((a, b) => {
      const aInStock = a.stock > 0 ? 1 : 0;
      const bInStock = b.stock > 0 ? 1 : 0;
      return bInStock - aInStock;
    });
}
