import { Book, ShoppingCart, TrendingUp, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const totalBooks = await prisma.book.count();

  const stats = [
    {
      title: 'کل کتاب‌ها',
      value: totalBooks.toString(),
      icon: Book,
      color: 'text-blue-500',
    },
    {
      title: 'سفارشات جدید',
      value: '۱۲',
      icon: ShoppingCart,
      color: 'text-green-500',
    },
    {
      title: 'کاربران ثبت‌نامی',
      value: '۳۴',
      icon: Users,
      color: 'text-orange-500',
    },
    {
      title: 'درآمد این ماه (تومان)',
      value: '۴,۲۵۰,۰۰۰',
      icon: TrendingUp,
      color: 'text-primary',
    },
  ];

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          داشبورد مدیریت
        </h1>
        <p className="text-muted-foreground mt-1">
          خلاصه‌ای از وضعیت فروشگاه شما
        </p>
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

      <div className="min-h-100 rounded-2xl border border-border/50 bg-card flex items-center justify-center text-muted-foreground shadow-sm">
        محل قرارگیری نمودار فروش یا آخرین سفارشات
      </div>
    </div>
  );
}
