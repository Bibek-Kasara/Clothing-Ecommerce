import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, CartItem } from '@/types/product';

interface OrderStore {
  orders: Order[];
  createOrder: (items: CartItem[], total: number) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  removeItemFromOrder: (orderId: string, productId: number, size: string) => void; // Added
  removeOrder: (orderId: string) => void; // Added
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (items, total) => {
        const order: Order = {
          id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          items: [...items],
          total,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          orders: [order, ...state.orders],
        }));

        return order;
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },

      // Removes an item from a specific order
      removeItemFromOrder: (orderId, productId, size) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id === orderId) {
              return {
                ...order,
                items: order.items.filter(
                  (item) => !(item.product.id === productId && item.size === size)
                ),
              };
            }
            return order;
          }),
        }));
      },

      // Removes an entire order
      removeOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        }));
      },
    }),
    {
      name: 'orders-storage',
    }
  )
);
