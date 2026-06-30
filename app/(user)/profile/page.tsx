import { MessageSquareQuote, ShoppingBag, UserCircle } from 'lucide-react';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { auth } from '@/auth';

import { EditShippingDialog } from '@/components/shared/EditShippingDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { autoCancelExpiredOrders } from '@/lib/actions/orders';
import { formatPrice } from '@/lib/format';
import { prisma } from '@/lib/prisma';

import { CancelOrderButton } from './_components/CancelOrderButton';
import { ProfileEditForm } from './_components/ProfileEditForm';
import { RepayButton } from './_components/RepayButton';

export const metadata: Metadata = {
  title: 'پروفایل کاربری',
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  await autoCancelExpiredOrders();

  const [userReviews, userOrders] = await Promise.all([
    prisma.review.findMany({
      where: { userId: session.user.id },
      include: {
        book: { select: { title: true, cover_image: true, id: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { book: { select: { title: true } } } } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const STATUS_MAP = {
    PENDING: {
      label: 'در انتظار پرداخت',
      color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    },
    PAID: {
      label: 'پرداخت شده',
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    },
    DELIVERED: {
      label: 'تحویل داده شده',
      color: 'bg-green-500/10 text-green-600 border-green-500/20',
    },
    CANCELLED: {
      label: 'لغو شده',
      color: 'bg-red-500/10 text-red-600 border-red-500/20',
    },
  };

  const displayName =
    session.user.name || session.user.email?.split('@')[0] || 'کاربر ورق';

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div className="bg-card border border-border/50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <Avatar className="size-24 border-4 border-muted">
          <AvatarImage src={session.user.image || ''} />
          <AvatarFallback className="text-3xl bg-primary/10 text-primary">
            {displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center md:text-right flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
          <p className="text-muted-foreground" dir="ltr">
            {session.user.email}
          </p>
          <div className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium mt-2">
            {session.user.role === 'ADMIN' ? 'مدیر سایت' : 'کاربر عادی'}
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-muted/50 rounded-xl p-1">
          <TabsTrigger
            value="info"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <UserCircle className="size-4" />
            <span className="hidden sm:inline mr-1"> اطلاعات حساب</span>
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline mr-1"> تاریخچه سفارشات</span>
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <MessageSquareQuote className="size-4" />
            <span className="hidden sm:inline mr-1"> نظرات من</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>اطلاعات شخصی</CardTitle>
              <CardDescription>مدیریت اطلاعات و حریم خصوصی</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold">آدرس ایمیل (شناسه کاربری)</p>
                  <p className="text-sm text-muted-foreground">
                    برای تغییر ایمیل لطفاً با پشتیبانی تماس بگیرید.
                  </p>
                </div>
                <div
                  className="font-medium bg-background px-4 py-2 rounded-lg border border-border/50"
                  dir="ltr"
                >
                  {session.user.email}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-bold mb-2">ویرایش مشخصات</h3>
                <ProfileEditForm
                  user={{
                    name: session.user.name || null,
                    image: session.user.image || null,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <div className="flex flex-col gap-4">
            {userOrders.length > 0 ? (
              userOrders.map(order => (
                <Card
                  key={order.id}
                  className="border-border/50 shadow-sm overflow-hidden pt-0"
                >
                  <div className="bg-muted/30 px-4 py-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                      <span className="text-muted-foreground">
                        {new Intl.DateTimeFormat('fa-IR').format(
                          order.createdAt,
                        )}
                      </span>
                      <Separator
                        orientation="vertical"
                        className="h-4 hidden sm:block"
                      />
                      <span className="text-primary font-bold">
                        {formatPrice(order.totalAmount)}
                      </span>
                      {order.trackId && (
                        <>
                          <Separator
                            orientation="vertical"
                            className="h-4 hidden sm:block"
                          />
                          <span className="text-muted-foreground">
                            کدرهگیری:{' '}
                            <span dir="ltr" className="text-foreground">
                              {order.trackId}
                            </span>
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <Badge
                        variant="outline"
                        className={STATUS_MAP[order.status].color}
                      >
                        {STATUS_MAP[order.status].label}
                      </Badge>

                      {order.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <CancelOrderButton orderId={order.id} />
                          <RepayButton orderId={order.id} />
                        </div>
                      )}
                    </div>
                  </div>
                  <CardContent className="px-4 py-2">
                    <div className="border-b pb-4 mb-4 border-border/50 text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              شماره تماس:
                            </span>
                            <span className="font-medium" dir="ltr">
                              {order.phone || 'ثبت نشده'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-muted-foreground whitespace-nowrap">
                              آدرس ارسال:
                            </span>
                            <span className="font-medium leading-relaxed">
                              {order.address || 'ثبت نشده'}
                            </span>
                          </div>
                        </div>
                        {(order.status === 'PENDING' ||
                          order.status === 'PAID') && (
                          <EditShippingDialog
                            orderId={order.id}
                            currentPhone={order.phone || ''}
                            currentAddress={order.address || ''}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-bold mb-1">اقلام سفارش:</p>
                      {order.items.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="bg-muted px-2 py-0.5 rounded text-xs font-bold">
                            {item.quantity} عدد
                          </span>
                          <span className="line-clamp-1">
                            {item.book.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-border/50 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <ShoppingBag className="size-16 text-muted-foreground/30" />
                  <p className="text-muted-foreground">
                    شما هنوز سفارشی ثبت نکرده‌اید.
                  </p>
                  <Button asChild variant="outline" className="mt-2 rounded-xl">
                    <Link href="/books">رفتن به فروشگاه</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userReviews.length > 0 ? (
              userReviews.map(review => (
                <Card key={review.id} className="border-border/50 shadow-sm">
                  <CardContent className="p-4 flex gap-4">
                    <Link
                      href={`/books/${review.bookId}`}
                      className="shrink-0 relative size-20 rounded-md overflow-hidden bg-muted"
                    >
                      <Image
                        src={review.book.cover_image}
                        alt={review.book.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </Link>
                    <div className="flex flex-col flex-1">
                      <Link
                        href={`/books/${review.bookId}`}
                        className="font-bold hover:text-primary transition-colors line-clamp-1"
                      >
                        {review.book.title}
                      </Link>
                      <div className="flex items-center mt-1 mb-2 text-yellow-500 text-sm">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        &quot;{review.text}&quot;
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-muted-foreground bg-card border border-border/50 rounded-2xl">
                هنوز هیچ نظری برای کتاب‌ها ثبت نکرده‌اید.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
