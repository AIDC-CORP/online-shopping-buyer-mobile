# Development Guide - AI Meal Planner & Grocery Assistant

## ✅ Setup Complete!

Your React Native Expo project has been successfully refactored and configured.

## 📋 What Was Changed:

### 1. **Package Management**
   - ✅ Removed Vite and web dependencies (react-dom, @vitejs/plugin-react)
   - ✅ Added Expo SDK 52 and React Native 0.76.5
   - ✅ Added NativeWind 4 for styling
   - ✅ Updated to @google/generative-ai for Gemini API

### 2. **Configuration Files**
   - ✅ Updated `package.json` with Expo scripts
   - ✅ Configured `app.json` for Expo with proper app metadata
   - ✅ Updated `tsconfig.json` for React Native
   - ✅ Created `metro.config.js` for Metro bundler with NativeWind
   - ✅ Updated `tailwind.config.js` with NativeWind preset
   - ✅ Updated `babel.config.js` for React Native

### 3. **Entry Point**
   - ✅ Changed from ReactDOM to `registerRootComponent`
   - ✅ Removed web-specific files (index.html, vite.config.ts)

### 4. **Services**
   - ✅ Updated Gemini service to use proper SDK
   - ✅ Changed environment variable to `EXPO_PUBLIC_GEMINI_API_KEY`

### 5. **Project Structure**
   - ✅ Created `.env.example` for environment setup
   - ✅ Updated `.gitignore` for React Native
   - ✅ Created `assets/` folder for app icons
   - ✅ Added comprehensive README.md

## 🚀 Quick Start:

### Option 1: Using the start script
```bash
./start.sh
```

### Option 2: Manual start
```bash
# 1. Copy environment file
cp .env.example .env

# 2. Add your Gemini API key to .env
# EXPO_PUBLIC_GEMINI_API_KEY=your_key_here

# 3. Start Expo
npm start
```

## 📱 Testing the App:

### On Physical Device (Recommended):
1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Run `npm start`
3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

### On Emulator:
```bash
# iOS (requires Mac with Xcode)
npm run ios

# Android (requires Android Studio)
npm run android
```

### On Web Browser (Experimental):
```bash
npm run web
```

## 🔑 Environment Variables:

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey

## 🛠 Available Scripts:

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser

## 📂 Project Structure:

```
ai-meal-planner-grocery-assistant/
├── App.tsx                    # Main app component
├── index.tsx                  # Entry point (registerRootComponent)
├── app.json                   # Expo configuration
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript config
├── babel.config.js            # Babel config for RN
├── metro.config.js            # Metro bundler config
├── tailwind.config.js         # Tailwind/NativeWind config
├── global.css                 # Global styles
├── .env                       # Environment variables (create this!)
├── .env.example               # Environment template
├── assets/                    # App icons & images
├── components/                # Reusable components
│   ├── common/               # Common UI components
│   └── icons/                # Icon components
├── context/                   # React Context
│   └── AppContext.tsx
├── features/                  # Feature modules
│   ├── auth/                 # Authentication
│   ├── shopping/             # Shopping screen
│   ├── cart/                 # Shopping cart
│   ├── orders/               # Order history
│   ├── profile/              # User profile
│   └── support/              # Chatbot support
├── services/                  # API services
│   ├── geminiService.ts      # Gemini AI integration
│   └── mockApiService.ts     # Mock data
└── types.ts                   # TypeScript types
```

## 🎨 Styling with NativeWind:

Use Tailwind classes directly in React Native components:

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-green-600">
        Hello World!
      </Text>
    </View>
  );
}
```

## 🐛 Common Issues:

### Metro bundler cache issues:
```bash
npx expo start -c
```

### TypeScript errors after dependency changes:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port already in use:
```bash
# Kill process on port 8081
npx kill-port 8081
npm start
```

## 🔧 VS Code Setup:

Recommended extensions:
- React Native Tools
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- ESLint

## 📦 Adding New Dependencies:

```bash
# Install a package
npm install package-name

# Install Expo-compatible package
npx expo install package-name
```

## 🚢 Building for Production:

### Development Build:
```bash
# Android
npx expo run:android

# iOS (Mac only)
npx expo run:ios
```

### Production Build:
For production builds, you'll need to configure EAS Build or use local builds.

## 📝 Next Steps:

1. ✅ Set up your `.env` file with Gemini API key
2. ✅ Run `npm start` to launch the dev server
3. ✅ Test on Expo Go or emulator
4. 🎨 Add your app icon/splash in `assets/` folder
5. 🚀 Start building features!

## 💡 Tips:

- **Hot Reload**: Shake your device to open developer menu
- **Debug**: Use `console.log()` or React Native Debugger
- **Performance**: Use React.memo and useCallback for optimization
- **Navigation**: Consider adding React Navigation for advanced routing

## 🆘 Need Help?

- Expo Docs: https://docs.expo.dev
- React Native Docs: https://reactnative.dev
- NativeWind Docs: https://www.nativewind.dev
- Gemini API Docs: https://ai.google.dev/docs

---

Happy coding! 🎉
