export interface Genre {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publication_year: number;
  genre: string[];
  description: string;
  cover_image: string;
  price: number;
}

export interface DatabaseSchema {
  books: Book[];
  genres: Genre[];
}
