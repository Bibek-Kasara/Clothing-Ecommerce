import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WishlistItem } from '@/types/product';

interface WishlistStore {
  items: WishlistItem[];
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        const isAlreadyInWishlist = get().items.some(item => item.productId === productId);
        if (!isAlreadyInWishlist) {
          set(state => ({
            items: [...state.items, { productId, addedAt: new Date().toISOString() }]
          }));
        }
      },

      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(item => item.productId !== productId)
        }));
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },

      getItemCount: () => {
        return get().items.length;
      }
    }),
    {
      name: 'wishlist-storage'
    }
  )
);