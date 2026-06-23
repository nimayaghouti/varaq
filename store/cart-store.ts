import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { clearCartDB, updateCartItemDB } from '@/lib/actions/cart';

import { Book } from '@/types';

export interface CartItem extends Book {
  quantity: number;
}

interface CartState {
  items: CartItem[];
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

      setCart: items => set({ items }),

      addItem: async book => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === book.id);
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.id === book.id ? { ...item, quantity: newQuantity } : item,
            ),
          });
        } else {
          set({ items: [...currentItems, { ...book, quantity: 1 }] });
        }

        await updateCartItemDB(book.id, newQuantity);
      },

      removeItem: async id => {
        set({ items: get().items.filter(item => item.id !== id) });
        await updateCartItemDB(id, 0);
      },

      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item,
          ),
        });
        await updateCartItemDB(id, quantity);
      },

      clearCart: async () => {
        set({ items: [] });
        await clearCartDB();
      },

      clearLocalCart: () => {
        set({ items: [] });
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
