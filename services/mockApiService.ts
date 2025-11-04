import { User, Product, Order } from '../types';

export const MOCK_USER: User = {
  id: 'user-123',
  phone: '0901234567',
  name: 'Nguyễn Văn A',
  height: 175,
  weight: 70,
  activityLevel: 'medium',
  allergies: ['Đậu phộng'],
  budget: 1500000,
};

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Thịt bò Úc', imageUrl: 'https://images.unsplash.com/photo-1603048297172-c925e476a625?q=80&w=400', price: 250000, store: 'FreshMart', category: 'Thịt' },
  { id: 'p2', name: 'Rau cải bó xôi', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f2f84?q=80&w=400', price: 25000, store: 'GreenGrocer', category: 'Rau củ' },
  { id: 'p3', name: 'Trứng gà ta', imageUrl: 'https://images.unsplash.com/photo-1587624542542-a84113093b5d?q=80&w=400', price: 40000, store: 'FreshMart', category: 'Trứng' },
  { id: 'p4', name: 'Phi lê cá hồi', imageUrl: 'https://images.unsplash.com/photo-1559735882-35360c8a77b8?q=80&w=400', price: 320000, store: 'OceanDelights', category: 'Hải sản' },
  { id: 'p5', name: 'Quả bơ', imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=400', price: 35000, store: 'GreenGrocer', category: 'Trái cây' },
  { id: 'p6', name: 'Sữa chua Hy Lạp', imageUrl: 'https://images.unsplash.com/photo-1562119422-b6a4a085627a?q=80&w=400', price: 120000, store: 'FreshMart', category: 'Sữa' },
  { id: 'p7', name: 'Hạt diêm mạch (Quinoa)', imageUrl: 'https://images.unsplash.com/photo-1611141755491-8a473f890538?q=80&w=400', price: 150000, store: 'PantryStaples', category: 'Ngũ cốc' },
  { id: 'p8', name: 'Dầu ô liu nguyên chất', imageUrl: 'https://images.unsplash.com/photo-1626082937798-2045c225159a?q=80&w=400', price: 210000, store: 'PantryStaples', category: 'Dầu ăn' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'DH001',
    date: '2024-07-28',
    status: 'completed',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 1 },
      { product: MOCK_PRODUCTS[1], quantity: 2 },
      { product: MOCK_PRODUCTS[2], quantity: 1 },
    ],
    total: 370000
  },
  {
    id: 'DH002',
    date: '2024-07-26',
    status: 'delivering',
    items: [
      { product: MOCK_PRODUCTS[4], quantity: 4 },
      { product: MOCK_PRODUCTS[3], quantity: 1 },
    ],
    total: 460000
  },
  {
    id: 'DH003',
    date: '2024-07-22',
    status: 'cancelled',
    items: [
      { product: MOCK_PRODUCTS[6], quantity: 1 },
    ],
    total: 150000
  }
];

// --- API Simulation ---

const apiDelay = <T,>(data: T, delay: number = 500): Promise<T> => 
    new Promise(resolve => setTimeout(() => resolve(data), delay));

export const fetchProducts = (query?: string): Promise<Product[]> => {
    if (query) {
        const lowerCaseQuery = query.toLowerCase();
        const filtered = MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(lowerCaseQuery));
        return apiDelay(filtered);
    }
    return apiDelay(MOCK_PRODUCTS);
};

export const fetchOrders = (): Promise<Order[]> => apiDelay(MOCK_ORDERS);

export const updateUserProfile = (user: User): Promise<User> => {
    console.log("Updating user profile:", user);
    // In a real app, this would merge with the existing user object
    return apiDelay(user, 800);
}