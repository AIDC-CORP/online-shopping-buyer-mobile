
export interface User {
  id: string;
  phone: string;
  name: string;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'low' | 'medium' | 'high';
  allergies: string[];
  budget: number; // optional budget per meal/day
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  store: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'picking' | 'delivering' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: CartItem[];
  total: number;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}
