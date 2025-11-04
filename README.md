# React Native Expo - AI Meal Planner & Grocery Assistant<div align="center">

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

This project has been refactored to work with **React Native Expo**.</div>



## 📋 Prerequisites# Run and deploy your AI Studio app



- Node.js 18+ installedThis contains everything you need to run your app locally.

- npm or yarn package manager

- Expo Go app on your mobile device (for testing)View your app in AI Studio: https://ai.studio/apps/drive/1xChYGIVv_eyWN5sn8IS0wu5EFMFqtUSO

- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Run Locally

## 🚀 Setup Instructions

**Prerequisites:**  Node.js

### 1. Install Dependencies



```bash1. Install dependencies:

npm install   `npm install`

```2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:

### 2. Configure Environment Variables   `npm run dev`


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
npm start
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
├── App.tsx                 # Main app component
├── index.tsx              # Entry point
├── components/            # Reusable UI components
├── features/              # Feature-specific screens
│   ├── auth/             # Login screen
│   ├── shopping/         # Shopping screen
│   ├── cart/             # Cart screen
│   ├── orders/           # Order history
│   ├── profile/          # User profile
│   └── support/          # Chatbot support
├── services/              # API services
├── context/               # React context
└── types.ts              # TypeScript types
```

## 🔧 Configuration Files

- `app.json` - Expo app configuration
- `babel.config.js` - Babel configuration for React Native
- `metro.config.js` - Metro bundler config with NativeWind
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## 🎨 Styling

This project uses **NativeWind 4**, which brings Tailwind CSS to React Native. You can use Tailwind utility classes directly in your components:

```tsx
<View className="flex-1 bg-slate-100">
  <Text className="text-xl font-bold text-green-600">Hello World</Text>
</View>
```

## 🐛 Troubleshooting

**Metro bundler not starting:**
```bash
npx expo start -c
```

**Dependencies issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
npm install --save-dev @types/react @types/react-native
```

## 📝 Notes

- The app uses mock data for products and orders (no backend required)
- Gemini API is used for AI meal planning and chatbot features
- Make sure to add asset files (icon.png, splash.png, adaptive-icon.png) in the `assets/` folder for production builds

## 🚢 Building for Production

For production builds, you can use Expo's build service or build locally:

```bash
# Local build for Android
npx expo run:android --variant release

# Local build for iOS  
npx expo run:ios --configuration Release
```

---

Happy coding! 🎉
