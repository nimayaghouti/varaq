'use server';

import { auth } from '@/auth';

import { prisma } from '@/lib/prisma';

export async function getUserCart() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { book: true },
      },
    },
  });
}

export async function updateCartItemDB(bookId: string, quantity: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: 'Unauthorized' };

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return { error: 'کتاب یافت نشد' };
    if (quantity > book.stock) return { error: 'موجودی انبار کافی نیست' };

    const cart = await prisma.cart.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id },
    });

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id, bookId },
      });
    } else {
      await prisma.cartItem.upsert({
        where: { cartId_bookId: { cartId: cart.id, bookId } },
        update: { quantity },
        create: { cartId: cart.id, bookId, quantity },
      });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در آپدیت سبد خرید رخ داد' };
  }
}

export async function clearCartDB() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: 'Unauthorized' };

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'خطایی در خالی کردن سبد خرید رخ داد' };
  }
}

interface LocalCartItem {
  id: string;
  quantity: number;
}

export async function mergeLocalCartWithDatabase(localItems: LocalCartItem[]) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: 'Unauthorized' };

    const userId = session.user.id;

    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: { items: true },
    });

    const combinedItems = new Map<string, number>();

    for (const item of cart.items) {
      combinedItems.set(item.bookId, item.quantity);
    }

    for (const localItem of localItems) {
      const existingQty = combinedItems.get(localItem.id) || 0;
      combinedItems.set(localItem.id, existingQty + localItem.quantity);
    }

    const bookIds = Array.from(combinedItems.keys());
    const books = await prisma.book.findMany({
      where: { id: { in: bookIds } },
    });
    const bookStockMap = new Map(books.map(b => [b.id, b.stock]));

    const finalItemsToSave = [];

    for (const [bookId, qty] of combinedItems.entries()) {
      const stock = bookStockMap.get(bookId);
      if (stock !== undefined && stock > 0) {
        const finalQty = Math.min(qty, stock);
        finalItemsToSave.push({ bookId, quantity: finalQty });
      }
    }

    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
      prisma.cartItem.createMany({
        data: finalItemsToSave.map(item => ({
          cartId: cart.id,
          bookId: item.bookId,
          quantity: item.quantity,
        })),
      }),
    ]);

    const updatedCartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { book: true },
    });

    const formattedCartForZustand = updatedCartItems.map(dbItem => ({
      ...dbItem.book,
      quantity: dbItem.quantity,
    }));

    return { success: true, mergedCart: formattedCartForZustand };
  } catch (error) {
    console.error('Cart Merge Error:', error);
    return { error: 'خطایی در ادغام سبد خرید رخ داد' };
  }
}
