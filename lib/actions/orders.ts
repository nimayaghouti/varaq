'use server';

import { OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';

import { checkAdmin } from '@/lib/actions/admin-books';
import { prisma } from '@/lib/prisma';

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
) {
  try {
    await checkAdmin();

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard');

    return { success: 'وضعیت سفارش با موفقیت به‌روزرسانی شد.' };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در تغییر وضعیت سفارش رخ داد.' };
  }
}

export async function cancelUserOrderAction(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: 'ابتدا وارد سایت شوید.' };

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== session.user.id) {
      return { error: 'سفارش یافت نشد.' };
    }

    if (order.status !== 'PENDING') {
      return { error: 'فقط سفارشات در انتظار پرداخت قابل لغو هستند.' };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    revalidatePath('/profile');
    return { success: 'سفارش شما با موفقیت لغو شد.' };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در لغو سفارش رخ داد.' };
  }
}

export async function autoCancelExpiredOrders() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await prisma.order.updateMany({
      where: {
        status: 'PENDING',
        updatedAt: { lt: twentyFourHoursAgo },
      },
      data: {
        status: 'CANCELLED',
      },
    });
  } catch (error) {
    console.error('Auto Cancel Error:', error);
  }
}
