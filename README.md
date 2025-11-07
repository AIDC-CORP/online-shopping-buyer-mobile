# AI Meal Planner & Grocery Assistant

<div align="center">
<img width="1200" height="475" alt="AI Meal Planner Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

A React Native Expo app that provides AI-powered meal planning and grocery shopping assistance using Google Gemini AI.
</div>

## 📋 Prerequisites

- Node.js 18+ installed
- yarn package manager
- Expo Go app on your mobile device (for testing)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
yarn install

```

### 3. Start the Development Server

```bash
yarn start
```

This will start the Expo development server. You'll see a QR code in your terminal.


```

**Using Expo Go:**
- Install Expo Go from App Store (iOS) or Play Store (Android)
- Scan the QR code from the terminal with your device camera (iOS) or Expo Go app (Android)

## 📱 Features

- **AI Meal Planning**: Get personalized meal suggestions based on your profile
- **Smart Shopping**: Browse products with AI-powered recommendations
- **Shopping Cart**: Add items to cart and checkout
- **Order History**: Track your past orders
- **AI Chatbot**: Get help with nutrition questions and cooking tips
- **User Profile**: Manage your dietary preferences and health info

## 🛠 Tech Stack

- **React Native** with **Expo** - Mobile framework
- **TypeScript** - Type safety
- **NativeWind 4** - Tailwind CSS for React Native
- **Google Generative AI** - AI-powered features
- **React Hooks** - State management

## 📂 Project Structure

```
├── App.tsx                 # Main app component with custom navigation
├── App.test.tsx           # Jest tests for App component
├── index.tsx              # Entry point
├── types.ts               # TypeScript type definitions
├── global.css             # Global CSS styles for NativeWind
├── __mocks__/             # Jest mocks
│   └── styleMock.ts      # CSS mock for testing
├── __tests__/             # Test files
│   ├── auth-flow.test.tsx
│   ├── otp-login-basic.test.tsx
│   └── useLogin.test.ts
├── assets/                # Static assets and images
│   └── README.md
├── components/            # Reusable UI components
│   ├── common/           # Shared components
│   │   ├── BottomNavBar.tsx
│   │   ├── Header.tsx
│   │   └── Spinner.tsx
│   └── icons/            # Icon components
│       └── Icons.tsx
├── context/               # React context for global state
│   └── AppContext.tsx    # Global state (user, cart, wallet)
├── features/              # Feature-specific modules
│   ├── auth/             # Authentication
│   │   ├── index.ts
│   │   ├── components/
│   │   ├── hooks/
│   │   │   └── useLogin.ts
│   │   └── screens/
│   │       └── LoginScreen.tsx
│   ├── shopping/         # Shopping and AI meal planning
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── AiMenuSuggestion.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductList.tsx
│   │   ├── hooks/
│   │   │   ├── useAiMenuSuggestion.ts
│   │   │   └── useShopping.ts
│   │   └── screens/
│   │       └── ShoppingScreen.tsx
│   ├── cart/             # Cart management
│   │   ├── index.ts
│   │   ├── components/
│   │   │   └── dialog/
│   │   │       └── CheckoutDialog.tsx
│   │   ├── hooks/
│   │   │   └── useCart.ts
│   │   └── screens/
│   │       └── CartScreen.tsx
│   ├── orders/           # Order history and details
│   │   ├── index.ts
│   │   ├── components/
│   │   │   └── dialogs/
│   │   │       └── OrderDetailDialog.tsx
│   │   ├── hooks/
│   │   │   ├── useOrderDetail.ts
│   │   │   └── useOrderHistory.ts
│   │   └── screens/
│   │       └── OrderHistoryScreen.tsx
│   ├── profile/          # User profile and wallet
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── TransactionHistory.tsx
│   │   │   ├── WalletCard.tsx
│   │   │   └── dialog/
│   │   │       ├── AddFamilyMemberDialog.tsx
│   │   │       ├── EditFamilyMemberDialog.tsx
│   │   │       ├── EditProfileDialog.tsx
│   │   │       └── TopUpDialog.tsx
│   │   ├── hooks/
│   │   │   ├── useAddFamilyMember.ts
│   │   │   ├── useEditFamilyMember.ts
│   │   │   └── useEditProfile.ts
│   │   └── screens/
│   │       └── ProfileScreen.tsx
│   ├── notifications/    # Notifications
│   │   ├── index.ts
│   │   ├── components/
│   │   │   └── NotificationsDialogs.tsx
│   │   ├── hooks/
│   │   │   └── useNotifications.ts
│   │   └── screens/
│   ├── support/          # AI chatbot support
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── ChatAI.tsx
│   │   │   └── ChatSeller.tsx
│   │   ├── hooks/
│   │   │   ├── useChatbot.ts
│   │   │   └── useSellerChat.ts
│   │   └── screens/
│   │       └── ChatScreen.tsx
├── services/              # API services and integrations
│   ├── geminiService.ts  # AI integration (currently mocked)
│   └── api/              # Mock API services
│       └── mockApiService.ts
├── app.json              # Expo app configuration
├── babel.config.js       # Babel configuration
├── eas.json             # Expo Application Services config
├── jest.config.json     # Jest testing configuration
├── metro.config.js      # Metro bundler config with NativeWind
├── nativewind-env.d.ts  # NativeWind TypeScript declarations
├── package.json         # Dependencies and scripts
├── start.sh             # Automated setup script
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🔧 Configuration Files

- `app.json` - Expo app configuration
- `babel.config.js` - Babel configuration for React Native
- `metro.config.js` - Metro bundler config with NativeWind integration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eas.json` - Expo Application Services configuration

## 🎨 Styling

This project uses **NativeWind 4**, which brings Tailwind CSS to React Native. You can use Tailwind utility classes directly in your components:

```tsx
<View className="flex-1 bg-slate-100">
  <Text className="text-xl font-bold text-green-600">Hello World</Text>
</View>
```

**Important Notes:**
- No styled HOCs - use `className` directly on React Native components
- NativeWind 4 removed the `styled()` wrapper functions

## 🐛 Troubleshooting

**Metro bundler not starting:**
```bash
npx expo start -c
```

**Dependencies issues:**
```bash
rm -rf node_modules yarn.lock
yarn install
```

**TypeScript errors:**
```bash
yarn add -D @types/react @types/react-native
```

**Clear all caches:**
```bash
rm -rf node_modules .expo .metro-cache
yarn install
npx expo start -c
```

## 📝 Development Notes

- The app uses mock data for products and orders (no backend required)
- Gemini API is used for AI meal planning and chatbot features
- All AI services currently use mock responses for development
- Vietnamese localization throughout the UI
- Custom navigation system (no React Navigation library)
- Context-based state management for user and cart data

## 🚢 Building for Production

For production builds, you can use Expo's build service or build locally:

```bash
# Local build for Android
npx expo run:android --variant release

# Local build for iOS
npx expo run:ios --configuration Release
```

Make sure to add asset files (icon.png, splash.png, adaptive-icon.png) in the `assets/` folder for production builds.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

---

Happy coding! 🎉
