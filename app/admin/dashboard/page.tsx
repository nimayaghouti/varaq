import {
  ArrowLeft,
  Book,
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

import { DashboardFilter } from './_components/DashboardFilter';
import { RevenueChart } from './_components/RevenueChart';

export const STATUS_MAP = {
  PENDING: {
    label: 'در انتظار پرداخت',
    color: 'text-yellow-600 bg-yellow-500/10',
  },
  PAID: { label: 'پرداخت شده', color: 'text-blue-600 bg-blue-500/10' },
  DELIVERED: {
    label: 'تحویل داده شده',
    color: 'text-green-600 bg-green-500/10',
  },
  CANCELLED: { label: 'لغو شده', color: 'text-red-600 bg-red-500/10' },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminDashboardPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const range =
    typeof resolvedParams.range === 'string' ? resolvedParams.range : '7d';

  const now = new Date();
  let startDate = new Date(0);
  let dateGrouping: 'day' | 'month' = 'day';
  let chartLength = 0;
  let chartTitle = 'نمودار فروش';

  switch (range) {
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      chartLength = 2;
      chartTitle = 'فروش ۲۴ ساعت گذشته';
      break;
    case '7d':
      startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      startDate.setHours(0, 0, 0, 0);
      chartLength = 7;
      chartTitle = 'فروش ۷ روز گذشته';
      break;
    case '30d':
      startDate = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
      startDate.setHours(0, 0, 0, 0);
      chartLength = 30;
      chartTitle = 'فروش ۳۰ روز گذشته';
      break;
    case '1y':
      startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      dateGrouping = 'month';
      chartLength = 12;
      chartTitle = 'فروش یک سال گذشته';
      break;
    case 'all':
      dateGrouping = 'month';
      chartLength = 12;
      chartTitle = 'فروش کل زمان‌ها';
      break;
  }

  await autoCancelExpiredOrders();

  const [
    totalBooks,
    totalUsers,
    filteredOrdersAgg,
    recentOrders,
    filteredOrdersForChart,
  ] = await Promise.all([
    prisma.book.count(),
    prisma.user.count({
      where: { role: 'USER', createdAt: { gte: startDate } },
    }),
    prisma.order.aggregate({
      _count: true,
      _sum: { totalAmount: true },
      where: {
        status: { in: ['PAID', 'DELIVERED'] },
        createdAt: { gte: startDate },
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.order.findMany({
      where: {
        status: { in: ['PAID', 'DELIVERED'] },
        createdAt: { gte: startDate },
      },
      select: { totalAmount: true, createdAt: true },
    }),
  ]);

  const totalRevenue = filteredOrdersAgg._sum.totalAmount || 0;
  const totalOrdersFiltered = filteredOrdersAgg._count || 0;

  let chartData: { name: string; total: number }[] = [];

  if (dateGrouping === 'day') {
    chartData = Array.from({ length: chartLength }).map((_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (chartLength - 1 - i));

      const dailyTotal = filteredOrdersForChart
        .filter(
          o =>
            o.createdAt.toISOString().split('T')[0] ===
            d.toISOString().split('T')[0],
        )
        .reduce((sum, order) => sum + order.totalAmount, 0);

      return {
        name: new Intl.DateTimeFormat('fa-IR', {
          month: 'short',
          day: 'numeric',
        }).format(d),
        total: dailyTotal,
      };
    });
  } else {
    chartData = Array.from({ length: chartLength }).map((_, i) => {
      const d = new Date(
        now.getFullYear(),
        now.getMonth() - (chartLength - 1 - i),
        1,
      );
      const targetMonth = d.getMonth();
      const targetYear = d.getFullYear();

      const monthlyTotal = filteredOrdersForChart
        .filter(
          o =>
            o.createdAt.getMonth() === targetMonth &&
            o.createdAt.getFullYear() === targetYear,
        )
        .reduce((sum, order) => sum + order.totalAmount, 0);

      return {
        name: new Intl.DateTimeFormat('fa-IR', {
          month: 'long',
          year: '2-digit',
        }).format(d),
        total: monthlyTotal,
      };
    });
  }

  const stats = [
    {
      title: 'کل کتاب‌ها',
      value: totalBooks.toString(),
      icon: Book,
      color: 'text-blue-500',
    },
    {
      title: 'سفارشات موفق',
      value: totalOrdersFiltered.toString(),
      icon: ShoppingCart,
      color: 'text-green-500',
    },
    {
      title: 'کاربران جدید',
      value: totalUsers.toString(),
      icon: Users,
      color: 'text-orange-500',
    },
    {
      title: 'درآمد کل (تومان)',
      value: formatPrice(totalRevenue).replace(' تومان', ''),
      icon: TrendingUp,
      color: 'text-primary',
    },
  ];

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8">
      <div className="flex flex-wrap justify-between gap-2 bg-muted/30 p-8 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <LayoutDashboard className="size-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              داشبورد مدیریت
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            آمار لحظه‌ای و وضعیت کلی فروشگاه
          </p>
        </div>
        <div className="self-end">
          <DashboardFilter />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={i}
              className="border-border/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 bg-muted rounded-md ${stat.color}`}>
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1">
        <RevenueChart data={chartData} title={chartTitle} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">آخرین سفارشات ثبت‌شده</h2>
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-primary cursor-pointer"
          >
            <Link href="/admin/orders">
              مشاهده همه <ArrowLeft className="size-4 mr-2" />
            </Link>
          </Button>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-right py-4 font-bold">
                    مشتری
                  </TableHead>
                  <TableHead className="text-right py-4 font-bold">
                    مبلغ سفارش
                  </TableHead>
                  <TableHead className="text-right py-4 font-bold">
                    تاریخ
                  </TableHead>
                  <TableHead className="text-right py-4 font-bold">
                    وضعیت
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{order.user.name || 'کاربر بدون نام'}</span>
                        <span className="text-xs text-muted-foreground">
                          {order.user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">
                      {formatPrice(order.totalAmount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Intl.DateTimeFormat('fa-IR', {
                        dateStyle: 'medium',
                      }).format(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_MAP[order.status].color}`}
                      >
                        {STATUS_MAP[order.status].label}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      هنوز هیچ سفارشی ثبت نشده است.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
