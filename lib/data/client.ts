import { DATA_URL } from '@/constants/config';
import { Book, DatabaseSchema, Genre } from '@/types';

export async function getDatabase(): Promise<DatabaseSchema> {
  try {
    const response = await fetch(DATA_URL, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching database:', error);
    return { books: [], genres: [] };
  }
}

export async function getBooks(): Promise<Book[]> {
  const db = await getDatabase();
  return db.books;
}

export async function getGenres(): Promise<Genre[]> {
  const db = await getDatabase();
  return db.genres;
}
