import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductSize } from '@/types/product';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: ProductSize, quantity?: number) => void;
  removeItem: (productId: number, size: ProductSize) => void;
  updateQuantity: (productId: number, size: ProductSize, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, size, quantity = 1) => {
        set(state => {
          const existingItemIndex = state.items.findIndex(
            item => item.product.id === product.id && item.size === size
          );

          if (existingItemIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          } else {
            return {
              items: [...state.items, { product, size, quantity }]
            };
          }
        });
      },

      removeItem: (productId, size) => {
        set(state => ({
          items: state.items.filter(
            item => !(item.product.id === productId && item.size === size)
          )
        }));
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.product.id === productId && item.size === size
              ? { ...item, quantity }
              : item
          )
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.onSale
            ? item.product.price * (1 - item.product.discountPercentage / 100)
            : item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false })
    }),
    {
      name: 'cart-storage'
    }
  )
);