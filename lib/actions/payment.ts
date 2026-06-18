'use server';

import * as z from 'zod';

import { auth } from '@/auth';

import { prisma } from '@/lib/prisma';
import { CheckoutSchema } from '@/lib/validations/checkout';

const ZIBAL_MERCHANT = 'zibal';
const ZIBAL_REQUEST_URL = 'https://gateway.zibal.ir/v1/request';
const ZIBAL_VERIFY_URL = 'https://gateway.zibal.ir/v1/verify';
const ZIBAL_START_URL = 'https://gateway.zibal.ir/start/';

const ZIBAL_STATUS_MAP: Record<string, string> = {
  '-1': 'در انتظار پرداخت',
  '-2': 'خطای داخلی شبکه پرداخت',
  '1': 'پرداخت شده - تاییدشده',
  '2': 'پرداخت شده - تاییدنشده',
  '3': 'عملیات پرداخت توسط کاربر لغو شد.',
  '4': 'شماره کارت نامعتبر می‌باشد.',
  '5': 'موجودی حساب کافی نمی‌باشد.',
  '6': 'رمز واردشده اشتباه می‌باشد.',
  '7': 'تعداد درخواست‌ها بیش از حد مجاز می‌باشد.',
  '8': 'تعداد پرداخت اینترنتی روزانه بیش از حد مجاز می‌باشد.',
  '9': 'مبلغ پرداخت اینترنتی روزانه بیش از حد مجاز می‌باشد.',
  '10': 'صادرکننده‌ی کارت نامعتبر می‌باشد.',
  '11': 'خطای سوییچ بانکی.',
  '12': 'کارت قابل دسترسی نمی‌باشد.',
};

export async function createOrderAndPay(
  values: z.infer<typeof CheckoutSchema>,
  cartItems: { id: string; quantity: number }[],
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'برای ثبت سفارش ابتدا وارد شوید.' };
    }

    if (!cartItems || cartItems.length === 0) {
      return { error: 'سبد خرید شما خالی است.' };
    }

    const validatedFields = CheckoutSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: 'اطلاعات ارسال نامعتبر است.' };
    }

    const { phone, address } = validatedFields.data;

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const book = await prisma.book.findUnique({ where: { id: item.id } });
      if (!book) return { error: `کتابی با شناسه ${item.id} یافت نشد.` };

      if (book.stock < item.quantity) {
        return { error: `موجودی کتاب "${book.title}" کافی نیست.` };
      }

      totalAmount += book.price * item.quantity;
      orderItemsData.push({
        bookId: book.id,
        quantity: item.quantity,
        price: book.price,
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        phone,
        address,
        status: 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
    });

    const requestBody = {
      merchant: ZIBAL_MERCHANT,
      amount: totalAmount * 10,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/verify`,
      description: `خرید از کتابفروشی ورق - سفارش ${order.id}`,
      orderId: order.id,
      mobile: phone,
    };

    const zibalRes = await fetch(ZIBAL_REQUEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const zibalData = await zibalRes.json();

    if (Number(zibalData.result) === 100 && zibalData.trackId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { trackId: zibalData.trackId.toString() },
      });

      return { url: `${ZIBAL_START_URL}${zibalData.trackId}` };
    } else {
      return {
        error: `خطای درگاه: ${zibalData.message} (کد ${zibalData.result})`,
      };
    }
  } catch (error) {
    console.error(error);
    return { error: 'خطای سرور در ثبت سفارش.' };
  }
}

export async function verifyPayment(
  trackId: string,
  success: string,
  status?: string,
) {
  try {
    const order = await prisma.order.findFirst({ where: { trackId } });
    if (!order) return { error: 'سفارش یافت نشد.' };

    if (order.status === 'PAID') return { success: true, orderId: order.id };

    if (success === '0') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
      });

      const errorMessage =
        status && ZIBAL_STATUS_MAP[status]
          ? ZIBAL_STATUS_MAP[status]
          : 'تراکنش ناموفق بود.';

      return { error: errorMessage };
    }

    const verifyRes = await fetch(ZIBAL_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant: ZIBAL_MERCHANT,
        trackId: trackId,
      }),
    });

    const verifyData = await verifyRes.json();

    if (verifyData.result === 100 || verifyData.result === 201) {
      await prisma.$transaction(async tx => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'PAID' },
        });

        const items = await tx.orderItem.findMany({
          where: { orderId: order.id },
        });
        for (const item of items) {
          await tx.book.update({
            where: { id: item.bookId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      });

      return { success: true, orderId: order.id };
    } else {
      return { error: `تراکنش ناموفق بود. کد خطا: ${verifyData.result}` };
    }
  } catch (error) {
    console.error(error);
    return { error: 'خطای سرور در تایید پرداخت.' };
  }
}
