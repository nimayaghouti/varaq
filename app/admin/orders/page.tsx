import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

import Link from 'next/link';

import { EditShippingDialog } from '@/components/shared/EditShippingDialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { autoCancelExpiredOrders } from '@/lib/actions/orders';
import { formatPrice } from '@/lib/format';
import { prisma } from '@/lib/prisma';

import { OrderStatusSelect } from './_components/OrderStatusSelect';

const ITEMS_PER_PAGE = 10;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;

  await autoCancelExpiredOrders();

  const [totalOrders, orders] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { book: { select: { title: true } } } },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

  return (
    <div className="p-6 md:p-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2 bg-muted/30 p-8 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <ShoppingCart className="size-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            مدیریت سفارشات
          </h1>
        </div>
        <p className="text-muted-foreground">
          پیگیری و تغییر وضعیت سفارشات کاربران
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-center py-4 font-bold w-16">
                  ردیف
                </TableHead>
                <TableHead className="text-right py-4 font-bold">
                  مشتری
                </TableHead>
                <TableHead className="text-right py-4 font-bold">
                  اقلام سفارش
                </TableHead>
                <TableHead className="text-right py-4 font-bold">
                  مبلغ کل
                </TableHead>
                <TableHead className="text-right py-4 font-bold">
                  کدرهگیری
                </TableHead>
                <TableHead className="text-right py-4 font-bold">
                  تاریخ ثبت
                </TableHead>
                <TableHead className="text-center py-4 font-bold w-48">
                  عملیات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell className="text-center text-muted-foreground font-medium border-0">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </TableCell>
                  <TableCell className="font-medium border-0">
                    <div className="flex flex-col">
                      <span>{order.user.name || 'بدون نام'}</span>
                      <span
                        className="text-xs text-muted-foreground text-end"
                        dir="ltr"
                      >
                        {order.user.email}
                      </span>
                      {order.phone && (
                        <span className="text-xs text-muted-foreground mt-1">
                          {order.phone}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="border-0 max-w-50">
                    <div className="flex flex-col gap-1">
                      {order.items.map(item => (
                        <span
                          key={item.id}
                          className="text-xs text-muted-foreground line-clamp-1"
                          title={item.book.title}
                        >
                          {item.quantity}x {item.book.title}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-primary border-0">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell
                    className="text-sm font-medium border-0 text-end"
                    dir="ltr"
                  >
                    {order.trackId || '-'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground border-0">
                    {new Intl.DateTimeFormat('fa-IR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    }).format(order.createdAt)}
                  </TableCell>
                  <TableCell className="border-0">
                    <div className="flex items-center gap-2">
                      <EditShippingDialog
                        orderId={order.id}
                        currentPhone={order.phone || ''}
                        currentAddress={order.address || ''}
                        disabled={
                          order.status === 'DELIVERED' ||
                          order.status === 'CANCELLED'
                        }
                      />
                      <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    هیچ سفارشی یافت نشد.
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
              <Link href={`/admin/orders?page=${currentPage - 1}`}>
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
              <Link href={`/admin/orders?page=${currentPage + 1}`}>
                بعدی <ChevronLeft className="size-4 mr-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
