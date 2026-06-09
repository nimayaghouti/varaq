import { Book } from '@/types';

import { getBooks } from './client';

export interface FilterParams {
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  genres?: string[];
}

export async function getFilteredBooks(params: FilterParams): Promise<Book[]> {
  let books = await getBooks();

  if (params.minPrice !== undefined) {
    books = books.filter(b => b.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    books = books.filter(b => b.price <= params.maxPrice!);
  }

  if (params.genres && params.genres.length > 0) {
    books = books.filter(b => b.genre.some(g => params.genres!.includes(g)));
  }

  if (params.sort) {
    switch (params.sort) {
      case 'price_asc':
        books.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        books.sort((a, b) => b.price - a.price);
        break;
      case 'year_desc':
        books.sort((a, b) => b.publication_year - a.publication_year);
        break;
      case 'year_asc':
        books.sort((a, b) => a.publication_year - b.publication_year);
        break;
      case 'title_asc':
        books.sort((a, b) => a.title.localeCompare(b.title, 'fa'));
        break;
      default:
        break;
    }
  }

  return books;
}
