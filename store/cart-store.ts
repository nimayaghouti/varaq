import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { clearCartDB, updateCartItemDB } from '@/lib/actions/cart';

import { Book } from '@/types';

export interface CartItem extends Book {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  syncPending: boolean;
  setCart: (items: CartItem[]) => void;
  addItem: (book: Book) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  clearLocalCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      syncPending: false,

      setCart: items => set({ items, syncPending: false }),

      addItem: async book => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === book.id);
        const currentQuantity = existingItem ? existingItem.quantity : 0;

        if (currentQuantity >= book.stock) {
          return;
        }

        const newQuantity = currentQuantity + 1;

        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.id === book.id ? { ...item, quantity: newQuantity } : item,
            ),
          });
        } else {
          set({ items: [...currentItems, { ...book, quantity: 1 }] });
        }

        const res = await updateCartItemDB(book.id, newQuantity);
        if (res?.error === 'Unauthorized') {
          set({ syncPending: true });
        }
      },

      removeItem: async id => {
        set({ items: get().items.filter(item => item.id !== id) });
        const res = await updateCartItemDB(id, 0);
        if (res?.error === 'Unauthorized') set({ syncPending: true });
      },

      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const item = get().items.find(i => i.id === id);
        if (item && quantity > item.stock) {
          return;
        }

        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item,
          ),
        });
        const res = await updateCartItemDB(id, quantity);
        if (res?.error === 'Unauthorized') set({ syncPending: true });
      },

      clearCart: async () => {
        set({ items: [], syncPending: false });
        await clearCartDB();
      },

      clearLocalCart: () => {
        set({ items: [], syncPending: false });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: 'varaq-cart-storage',
    },
  ),
);
