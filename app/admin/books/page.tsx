import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { formatPrice } from '@/lib/format';
import { prisma } from '@/lib/prisma';

import { AddBookDialog } from './_components/AddBookDialog';
import { BookActions } from './_components/BookActions';

const ITEMS_PER_PAGE = 10;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminBooksPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;

  const [totalBooks, books] = await Promise.all([
    prisma.book.count(),
    prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  ]);

  const totalPages = Math.ceil(totalBooks / ITEMS_PER_PAGE);

  return (
    <div className="p-6 md:p-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2 bg-muted/30 p-8 rounded-2xl border border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <BookOpen className="size-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            مدیریت کتاب‌ها
          </h1>
        </div>
        <p className="text-muted-foreground">
          افزودن، ویرایش و حذف کتاب‌های فروشگاه
        </p>
      </div>
      <div className="flex items-center justify-between flex-wrap">
        <div className="text-sm text-muted-foreground">
          {totalBooks} کتاب یافت شد
        </div>
        <AddBookDialog />
      </div>

      <div className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-center py-4 font-bold w-16">
                  ردیف
                </TableHead>
                <TableHead className="text-right py-4 font-bold">
                  عنوان کتاب
                </TableHead>
                <TableHead className="text-right py-4 font-bold">
                  نویسنده
                </TableHead>
                <TableHead className="text-right py-4 font-bold">
                  قیمت
                </TableHead>
                <TableHead className="text-right py-4 font-bold">
                  موجودی
                </TableHead>
                <TableHead className="text-center py-4 font-bold">
                  عملیات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book, index) => (
                <TableRow key={book.id}>
                  <TableCell className="text-center text-muted-foreground font-medium border-0">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </TableCell>
                  <TableCell
                    className="font-bold line-clamp-1 max-w-50 mt-2 border-0"
                    title={book.title}
                  >
                    {book.title}
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{formatPrice(book.price)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        book.stock < 5 ? 'text-destructive font-bold' : ''
                      }
                    >
                      {book.stock} عدد
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <BookActions book={book} />
                  </TableCell>
                </TableRow>
              ))}
              {books.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    هیچ کتابی در پایگاه داده یافت نشد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 p-4 border-t border-border/50 bg-muted/20 rounded-b-2xl mt-auto">
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={currentPage <= 1}
              className={
                currentPage <= 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer hover:bg-background'
              }
            >
              <Link href={`/admin/books?page=${currentPage - 1}`}>
                <ChevronRight className="size-4 ml-1" /> قبلی
              </Link>
            </Button>

            <span className="text-sm font-medium px-4 text-muted-foreground">
              صفحه <span className="text-foreground">{currentPage}</span> از{' '}
              {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={currentPage >= totalPages}
              className={
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer hover:bg-background'
              }
            >
              <Link href={`/admin/books?page=${currentPage + 1}`}>
                بعدی <ChevronLeft className="size-4 mr-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
