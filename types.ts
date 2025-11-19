
export interface User {
  id: string;
  phone: string;
  name: string;
  age: number;
  location: string[];
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'low' | 'medium' | 'high';
  allergies: string[];
  budget: number; // optional budget per meal/day
  walletBalance: number; // wallet balance in VND
  familyMembers: { 
    member_id?: string;
    name: string; 
    age: number; 
    location: string[]; 
    height: number; 
    weight: number; 
    activityLevel: 'low' | 'medium' | 'high'; 
    allergies: string[] 
  }[];
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

export interface ChatConversation {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: string;
    updatedAt: string;
}

export type WalletTransactionType = 'top_up' | 'payment' | 'refund';

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  description: string;
  date: string;
  orderId?: string; // for payment transactions
}

export type NotificationType = 'order_update' | 'promotion' | 'system' | 'reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  orderId?: string; // for order-related notifications
  actionUrl?: string; // optional action URL
}

export enum Screen {
  Shopping,
  Orders,
  Profile,
  Chat,
  Cart,
}
