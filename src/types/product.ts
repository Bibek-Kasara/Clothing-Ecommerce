export type ProductSize = 'S' | 'M' | 'L' | 'XL';
export type Gender = 'men' | 'women' | 'unisex';

export interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  description: string;
  price: number; // USD
  discountPercentage: number;
  images: string[];
  rating: number;
  stock: number;
  gender?: Gender;
  sizes: ProductSize[];
  onSale: boolean;
  thumbnail: string;
}

export interface CartItem {
  product: Product;
  size: ProductSize;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number; // NPR
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress?: Address;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface WishlistItem {
  productId: number;
  addedAt: string;
}