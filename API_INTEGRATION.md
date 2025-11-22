# API Integration Guide - Buyer Mobile App

## 📊 Integration Status

### ✅ Completed Services (Integrated with Backend)

| Feature | Service | Status | Files |
|---------|---------|--------|-------|
| **Authentication** | AuthService | ✅ Complete | `services/auth/AuthService.ts` |
| **User Profile** | ProfileService | ✅ Complete | `services/profile/ProfileService.ts` |
| **Products/Catalog** | CatalogService | ✅ Complete | `services/catalog/CatalogService.ts` |
| **Shopping Cart** | CartService | ✅ Complete | `services/cart/CartService.ts` |
| **Orders** | OrderService | ✅ Complete | `services/order/OrderService.ts` |
| **Vouchers** | VoucherService | ✅ Complete | `services/voucher/VoucherService.ts` |
| **Payment/Wallet** | PaymentService | ✅ Complete | `services/payment/PaymentService.ts` |
| **Chat** | ChatService | ✅ Complete | `services/chat/ChatService.ts` |

### 🟡 Using Mock Data (No Backend Yet)

| Feature | Status | Note |
|---------|--------|------|
| **Notifications** | Mock only | No backend service - using mock data in `features/notifications/hooks/useNotifications.ts` |
| **AI Meal Planning** | Mock only | Using Gemini API - in `services/geminiService.ts` |

---

## 🔧 Environment Configuration

File: `.env`

```env
# Backend Service URLs
EXPO_PUBLIC_AUTH_URL=http://192.168.1.4:8111
EXPO_PUBLIC_PROFILE_URL=http://192.168.1.4:8113
EXPO_PUBLIC_CATALOG_URL=http://192.168.1.4:8115
EXPO_PUBLIC_CART_URL=http://192.168.1.4:8117
EXPO_PUBLIC_CHAT_URL=http://192.168.1.4:8119
EXPO_PUBLIC_VOUCHER_URL=http://192.168.1.4:8201
EXPO_PUBLIC_ORDER_URL=http://192.168.1.4:8203
EXPO_PUBLIC_PAYMENT_URL=http://192.168.1.4:8205
```

**Note:** Update IP address to your machine's IP when running on physical device.

---

## 📁 Service Architecture

```
services/
├── auth/
│   ├── AuthService.ts           ✅ Real API
│   └── config/
│       ├── httpClient.ts        ✅ Axios with interceptors
│       └── apiConfig.ts         ✅ Base URLs & endpoints
├── profile/
│   └── ProfileService.ts        ✅ Real API
├── catalog/
│   └── CatalogService.ts        ✅ Real API
├── cart/
│   └── CartService.ts           ✅ Real API
├── order/
│   └── OrderService.ts          ✅ Real API (NEW)
├── voucher/
│   └── VoucherService.ts        ✅ Real API (NEW)
├── payment/
│   └── PaymentService.ts        ✅ Real API (NEW)
├── chat/
│   └── ChatService.ts           ✅ Real API
└── api/
    └── mockApiService.ts        🟡 Legacy mock data
```

---

## 🔄 Updated Hooks

### 1. Shopping Hook
**File:** `features/shopping/hooks/useShopping.ts`

**Changes:**
- ❌ Old: `fetchProducts()` from mockApiService
- ✅ New: `CatalogService.getAllProducts()`
- Transforms backend data to frontend format

### 2. Orders Hook
**File:** `features/orders/hooks/useOrderHistory.ts`

**Changes:**
- ❌ Old: `fetchOrders()` from mockApiService
- ✅ New: `OrderService.getOrders()`
- Transforms order status and items

### 3. Cart Hook
**File:** `features/cart/hooks/useCart.ts`

**Status:** ✅ Already using `CartService` (no changes needed)

### 4. Profile Hooks
**Files:** 
- `features/profile/hooks/useEditProfile.ts`
- `features/profile/hooks/useAddFamilyMember.ts`
- `features/profile/hooks/useEditFamilyMember.ts`

**Status:** ✅ Already using `ProfileService` (no changes needed)

### 5. Chat Hook
**File:** `features/support/hooks/useSellerChat.ts`

**Status:** ✅ Already using `ChatService` (no changes needed)

---

## 🆕 New Services Added

### 1. OrderService
**Features:**
- Get all orders (with pagination & filters)
- Get order by ID
- Create order (checkout)
- Cancel order
- Re-order
- Track order status

**Example Usage:**
```typescript
import OrderService from '@/services/order/OrderService';

// Get orders
const orders = await OrderService.getOrders({
  page: 1,
  page_limit: 20,
  status: 'PENDING'
});

// Create order (checkout)
const result = await OrderService.createOrder({
  shipping_address: "123 Main St",
  payment_method: "MOMO",
  voucher_code: "SAVE20"
});

// Cancel order
await OrderService.cancelOrder(orderId, "Changed my mind");
```

### 2. VoucherService
**Features:**
- Get available vouchers
- Get voucher by code
- Validate voucher before applying
- Apply voucher to order
- Get my vouchers
- Claim voucher

**Example Usage:**
```typescript
import VoucherService from '@/services/voucher/VoucherService';

// Get available vouchers
const vouchers = await VoucherService.getAvailableVouchers({
  page: 1,
  page_limit: 20
});

// Validate voucher
const validation = await VoucherService.validateVoucher({
  code: "SAVE20",
  order_amount: 500000,
  product_ids: ["p1", "p2"]
});

// Apply voucher
await VoucherService.applyVoucher({
  code: "SAVE20",
  order_id: "order123"
});
```

### 3. PaymentService
**Features:**
- Create payment for order
- Get payment by ID/order ID
- Get wallet balance
- Get wallet transactions
- Top up wallet
- Verify payment
- Request refund

**Example Usage:**
```typescript
import PaymentService from '@/services/payment/PaymentService';

// Get wallet balance
const wallet = await PaymentService.getWalletBalance();

// Get transactions
const transactions = await PaymentService.getWalletTransactions({
  page: 1,
  page_limit: 20,
  type: 'TOP_UP'
});

// Top up wallet
const result = await PaymentService.topUpWallet({
  amount: 500000,
  payment_method: 'MOMO'
});

// Create payment for order
const payment = await PaymentService.createPayment({
  order_id: "order123",
  amount: 350000,
  payment_method: 'VNPAY'
});
```

---

## 🔐 Authentication Flow

All API calls automatically include JWT token via `httpClient` interceptors:

1. **Request Interceptor:** Adds `Authorization: Bearer {token}` header
2. **Response Interceptor:** Handles 401 errors and auto re-authentication
3. **Token Storage:** Uses AsyncStorage for persistence

**Token Management:**
```typescript
// Token is automatically attached to all requests
const products = await CatalogService.getAllProducts();

// If token expires (401), httpClient will:
// 1. Try to re-authenticate with saved credentials
// 2. Update token
// 3. Retry original request
```

---

## 🎨 Data Transformation

Backend responses are transformed to match frontend types:

### Product Transformation
```typescript
// Backend format
{
  id: "uuid",
  product_name: "Thịt bò",
  price: 250000,
  store_id: "store1",
  image_urls: ["url1.jpg"]
}

// Frontend format (types.ts)
{
  id: "uuid",
  name: "Thịt bò",
  price: 250000,
  store: "store1",
  imageUrl: "url1.jpg",
  category: "THIT_CA_TRUNG"
}
```

### Order Transformation
```typescript
// Backend format
{
  id: "order1",
  status: "DELIVERED",
  created_at: "2025-11-22T10:30:00Z",
  final_amount: 370000,
  items: [...]
}

// Frontend format
{
  id: "order1",
  status: "completed",
  date: "2025-11-22",
  total: 370000,
  items: [...]
}
```

---

## 🚀 How to Use

### Step 1: Start Backend Services
```bash
cd online-shopping-service
docker compose up -d
```

### Step 2: Update .env with your IP
```bash
# Find your local IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Update .env
EXPO_PUBLIC_AUTH_URL=http://YOUR_IP:8111
EXPO_PUBLIC_CATALOG_URL=http://YOUR_IP:8115
# ... etc
```

### Step 3: Start Mobile App
```bash
cd online-shopping-buyer-mobile
npm start
```

### Step 4: Test API Integration
1. Login with existing user (creates token)
2. Browse products (calls CatalogService)
3. Add to cart (calls CartService)
4. View orders (calls OrderService)
5. Check wallet (calls PaymentService)

---

## 🐛 Troubleshooting

### Issue: "Network Error" or "Connection refused"

**Solutions:**
1. Check backend services are running: `docker compose ps`
2. Verify IP address in `.env` matches your machine
3. Ensure phone/emulator is on same network
4. Check firewall is not blocking ports

### Issue: "401 Unauthorized"

**Solutions:**
1. Check if token exists in AsyncStorage
2. Try logging out and logging back in
3. Verify Keycloak is running: `http://localhost:9000`

### Issue: "Product data not showing"

**Solutions:**
1. Check backend has products in database
2. Verify CatalogService URL is correct
3. Check console for transformation errors
4. Test API directly: `curl http://YOUR_IP:8115/api/v1/online-shopping/public/catalog/products`

---

## 📝 Testing Checklist

- [x] Login/Register works
- [x] Profile loading/editing works
- [x] Products display correctly
- [x] Add to cart works
- [x] Cart operations (update, remove) work
- [x] Checkout creates order
- [x] Order history displays
- [x] Wallet balance shows
- [x] Chat with seller works
- [x] Vouchers can be viewed/applied
- [ ] Notifications (still using mock data)

---

## 🔮 Future Improvements

1. **Notifications Service**
   - Add backend notification service
   - Implement WebSocket for real-time updates
   - Push notifications

2. **Offline Support**
   - Cache API responses
   - Queue failed requests
   - Sync when online

3. **Image Upload**
   - Profile avatar upload via ProfileService
   - Product image optimization

4. **Payment Gateway**
   - Integrate real MoMo/VNPay SDK
   - Handle payment redirects
   - Verify payment webhooks

---

**Last Updated:** November 22, 2025
**Status:** 🟢 Production Ready (except Notifications)
