import { User, Product, Order, WalletTransaction, Notification } from '../../types';

export const MOCK_USER: User = {
  id: 'user-123',
  phone: '0901234567',
  name: 'Nguyễn Văn A',
  age: 30,
  location: 'Hồ Chí Minh',
  height: 175,
  weight: 70,
  activityLevel: 'medium',
  allergies: ['Đậu phộng'],
  budget: 1500000,
  walletBalance: 500000, // 500k VND
  familyMembers: [
    { name: 'Nguyễn Thị B', age: 28, location: 'Hồ Chí Minh', height: 165, weight: 55, activityLevel: 'medium', allergies: [] },
    { name: 'Nguyễn Văn C', age: 5, location: 'Hồ Chí Minh', height: 110, weight: 20, activityLevel: 'high', allergies: ['Sữa'] },
  ],
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

// Mock Wallet Transactions
export const MOCK_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'txn-001',
    type: 'top_up',
    amount: 1000000,
    description: 'Nạp tiền qua Momo',
    date: '2024-07-25T10:00:00Z',
  },
  {
    id: 'txn-002',
    type: 'payment',
    amount: -370000,
    description: 'Thanh toán đơn hàng DH001',
    date: '2024-07-28T14:30:00Z',
    orderId: 'DH001',
  },
  {
    id: 'txn-003',
    type: 'top_up',
    amount: 500000,
    description: 'Nạp tiền qua thẻ tín dụng',
    date: '2024-07-30T09:15:00Z',
  },
];

// Mock Notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'order_update',
    title: 'Đơn hàng đã được giao thành công',
    message: 'Đơn hàng DH001 của bạn đã được giao thành công. Cảm ơn bạn đã tin tưởng FreshMart!',
    date: '2024-07-28T16:00:00Z',
    isRead: false,
    orderId: 'DH001',
  },
  {
    id: 'notif-002',
    type: 'promotion',
    title: 'Giảm giá 20% cho khách hàng thân thiết',
    message: 'Chúc mừng! Bạn được giảm 20% cho đơn hàng tiếp theo. Áp dụng cho tất cả sản phẩm.',
    date: '2024-07-27T10:00:00Z',
    isRead: true,
  },
  {
    id: 'notif-003',
    type: 'order_update',
    title: 'Đơn hàng đang được giao',
    message: 'Đơn hàng DH002 đang trên đường giao đến bạn. Thời gian dự kiến: 30 phút.',
    date: '2024-07-26T14:00:00Z',
    isRead: false,
    orderId: 'DH002',
  },
  {
    id: 'notif-004',
    type: 'system',
    title: 'Cập nhật ứng dụng',
    message: 'Phiên bản mới của ứng dụng đã có sẵn. Cập nhật ngay để trải nghiệm các tính năng mới!',
    date: '2024-07-25T09:00:00Z',
    isRead: true,
  },
  {
    id: 'notif-005',
    type: 'reminder',
    title: 'Nhắc nhở bổ sung dinh dưỡng',
    message: 'Dựa trên kế hoạch ăn uống của bạn, hãy bổ sung thêm rau xanh và trái cây tươi.',
    date: '2024-07-24T08:00:00Z',
    isRead: false,
  },
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

export const addFamilyMember = (member: { name: string; age: number; location: string; height: number; weight: number; activityLevel: 'low' | 'medium' | 'high'; allergies: string[] }): Promise<{ name: string; age: number; location: string; height: number; weight: number; activityLevel: 'low' | 'medium' | 'high'; allergies: string[] }> => {
    console.log("Adding family member:", member);
    return apiDelay(member, 500);
}

export const updateFamilyMember = (member: { name: string; age: number; location: string; height: number; weight: number; activityLevel: 'low' | 'medium' | 'high'; allergies: string[] }): Promise<{ name: string; age: number; location: string; height: number; weight: number; activityLevel: 'low' | 'medium' | 'high'; allergies: string[] }> => {
    console.log("Updating family member:", member);
    return apiDelay(member, 500);
}

export const fetchWalletTransactions = (): Promise<WalletTransaction[]> => apiDelay(MOCK_WALLET_TRANSACTIONS);

export const topUpWallet = (amount: number, method: string): Promise<{ success: boolean; newBalance: number }> => {
    console.log(`Topping up wallet with ${amount} via ${method}`);
    const newBalance = MOCK_USER.walletBalance + amount;
    // In a real app, this would update the user's balance on the server
    return apiDelay({ success: true, newBalance }, 1000);
}

export const fetchNotifications = (): Promise<Notification[]> => apiDelay(MOCK_NOTIFICATIONS);

export const markNotificationAsRead = (notificationId: string): Promise<{ success: boolean }> => {
    console.log(`Marking notification ${notificationId} as read`);
    return apiDelay({ success: true }, 300);
}