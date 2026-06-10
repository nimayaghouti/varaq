import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Book } from '@/types';

export interface CartItem extends Book {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: book => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === book.id);

        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.id === book.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({ items: [...currentItems, { ...book, quantity: 1 }] });
        }
      },

      removeItem: id => {
        set({ items: get().items.filter(item => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

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
