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

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your Gemini API key:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Start the Development Server

```bash
yarn start
```

This will start the Expo development server. You'll see a QR code in your terminal.

### 4. Run on Device/Emulator

**On iOS:**
```bash
npm run ios
```

**On Android:**
```bash
npm run android
```

**On Web (experimental):**
```bash
npm run web
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
├── index.tsx              # Entry point
├── components/            # Reusable UI components
│   ├── common/           # Shared components (Header, BottomNavBar, etc.)
│   └── icons/            # Icon components
├── features/              # Feature-specific modules
│   ├── auth/             # Authentication screens and logic
│   ├── shopping/         # Shopping screens and AI meal planning
│   ├── cart/             # Cart management
│   ├── orders/           # Order history and details
│   ├── profile/          # User profile management
│   └── support/          # AI chatbot support
├── services/              # API services and integrations
│   ├── geminiService.ts  # AI integration (currently mocked)
│   └── api/              # Mock API services
├── context/               # React context for global state
├── types.ts              # TypeScript type definitions
└── assets/               # Static assets and images
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
