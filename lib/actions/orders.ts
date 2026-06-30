'use server';

import { OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

import { auth } from '@/auth';

import { checkAdmin } from '@/lib/actions/admin-books';
import { prisma } from '@/lib/prisma';
import { CheckoutSchema } from '@/lib/validations/checkout';

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
) {
  try {
    await checkAdmin();

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return { error: 'سفارش یافت نشد.' };

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      return { error: 'وضعیت این سفارش نهایی شده و قابل تغییر نیست.' };
    }

    if (order.status === 'PAID' && status === 'PENDING') {
      return { error: 'سفارش پرداخت‌شده قابل بازگشت به حالت در انتظار نیست.' };
    }

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

export async function updateOrderShippingAction(
  orderId: string,
  values: Omit<z.infer<typeof CheckoutSchema>, 'fullName'>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: 'ابتدا وارد سایت شوید.' };

    const EditSchema = CheckoutSchema.omit({ fullName: true });
    const validatedFields = EditSchema.safeParse(values);
    if (!validatedFields.success)
      return { error: 'داده‌های وارد شده نامعتبر است.' };

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return { error: 'سفارش یافت نشد.' };

    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return { error: 'دسترسی غیرمجاز' };
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      return { error: 'سفارشات پایان‌یافته قابل ویرایش نیستند.' };
    }

    const { phone, address } = validatedFields.data;

    await prisma.order.update({
      where: { id: orderId },
      data: { phone, address },
    });

    revalidatePath('/profile');
    revalidatePath('/admin/orders');

    return { success: 'اطلاعات ارسال با موفقیت به‌روزرسانی شد.' };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در ویرایش سفارش رخ داد.' };
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
