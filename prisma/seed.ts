import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DATA_URL =
  'https://raw.githubusercontent.com/nimayaghouti/booktabdata/main/db.json';

async function main() {
  console.log('Connecting to database and fetching data...');

  try {
    const response = await fetch(DATA_URL);
    const data = await response.json();
    const books = data.books;
    const genres = data.genres;

    console.log(
      `Found ${books.length} books and ${genres.length} genres. Starting seeding process...`,
    );

    await prisma.book.deleteMany();
    await prisma.genre.deleteMany();
    console.log('Previous database records cleared.');

    for (const genre of genres) {
      await prisma.genre.create({
        data: {
          name: genre.name,
        },
      });
    }
    console.log('Genres seeded successfully.');

    for (const book of books) {
      await prisma.book.create({
        data: {
          title: book.title,
          author: book.author,
          publication_year: String(book.publication_year),
          description: book.description,
          cover_image: book.cover_image,
          price: book.price,
          stock: 15,
          genres: book.genre,
        },
      });
    }
    console.log('Books seeded successfully.');

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
