# AI Coding Agent Instructions - AI Meal Planner & Grocery Assistant

## Project Overview
This is a React Native Expo app that provides AI-powered meal planning and grocery shopping assistance. The app uses Gemini AI for personalized meal recommendations and integrates with a shopping cart system.

## Architecture & Key Patterns

### State Management
- **Context-based**: Uses `AppContext` for global state (user, cart, wallet transactions)
- **Local state**: Component-level state with `useState` hooks
- **Performance**: Heavy use of `useCallback` for memoization to prevent unnecessary re-renders
- **Wallet integration**: Built-in wallet system with balance tracking and transaction history

### Component Structure
```
features/
├── screenName/
│   ├── ScreenName.tsx          # Main screen component
│   ├── components/             # Screen-specific components
│   ├── hooks/                  # Custom hooks (useFeature.ts)
│   └── index.ts                # Type exports and interfaces
```

### Navigation Pattern
- **Custom routing**: Screen-based navigation in `App.tsx` (no React Navigation library)
- **Screen enum**: `Screen.Shopping`, `Screen.Orders`, etc. for navigation state
- **Conditional rendering**: Screens render based on `activeScreen` state and `selectedOrder`
- **Order detail flow**: Special handling for order detail screens that overlay other screens

### Styling
- **NativeWind 4**: Tailwind CSS classes directly in `className` props
- **No styled HOCs**: Use `className` directly on React Native components (removed in NativeWind 4 migration)
- **Example**: `<View className="flex-1 bg-slate-100">`
- **Metro config**: `withNativeWind(config, { input: './global.css' })` for CSS processing

### AI Integration
- **Gemini API**: Used for meal planning (`generateMealPlan`) and chatbot (`getChatbotResponse`)
- **Environment**: `EXPO_PUBLIC_GEMINI_API_KEY` required (must be prefixed with `EXPO_PUBLIC_`)
- **Error handling**: Graceful fallbacks with user-friendly Vietnamese messages
- **Mock mode**: Services use mock data with simulated delays (`apiDelay` function) for development
- **Meal planning**: AI generates meal suggestions based on user profile (age, weight, allergies, etc.)

### Data Layer
- **Mock data**: All data is mocked in `mockApiService.ts` with Vietnamese product names
- **No backend**: Pure frontend with simulated API delays (500-1000ms) for realistic UX
- **Types**: Strongly typed with TypeScript interfaces in `types.ts`
- **Family profiles**: Support for multiple family members with individual dietary preferences

## Development Workflow

### Setup
```bash
cp .env.example .env
# Add EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here to .env
yarn install
yarn start
```

### Testing
- **Expo Go**: Scan QR code for physical device testing
- **Emulators**: `yarn ios` / `yarn android`
- **Web**: `yarn web` (experimental, limited functionality)

### Common Commands
- `npx expo start -c`: Clear Metro cache when bundling fails
- `rm -rf node_modules && yarn install`: Clean reinstall for dependency issues
- `./start.sh`: Automated setup and start script (if available)

## Code Patterns & Conventions

### Component Structure
```tsx
const ComponentName: React.FC = () => {
  const [state, setState] = useState(initialValue);
  const { contextValue } = useAppContext();

  const memoizedCallback = useCallback(() => {
    // Implementation with proper error handling
  }, [dependencies]); // Include ALL dependencies

  return (
    <View className="styles">
      {/* JSX with Vietnamese text */}
    </View>
  );
};
```

### AI Service Calls
```tsx
const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    const result = await aiService.function(user);
    setData(result);
  } catch (error) {
    setError(error.message || 'Đã xảy ra lỗi không xác định.');
  } finally {
    setLoading(false);
  }
}, [user]);
```

### Cart Operations
```tsx
const { addToCart, removeFromCart, updateCartItemQuantity, cartTotal } = useAppContext();
// Use these methods for cart management - they handle quantity updates automatically
```

### Feature Organization
- **Index exports**: Each feature has `index.ts` for type exports and interfaces
- **Hook naming**: `useFeatureName.ts` for custom hooks
- **Component naming**: PascalCase for components, camelCase for hooks
- **Screen components**: Main screens in `screens/` directory

### Vietnamese Localization
- **UI Language**: All user-facing text in Vietnamese
- **Error messages**: User-friendly Vietnamese error messages
- **Product data**: Mock products have Vietnamese names (e.g., "Thịt bò Úc", "Rau cải bó xôi")
- **Code comments**: Mix of English and Vietnamese comments

## Key Files Reference

- `App.tsx`: Main navigation and screen routing with custom Screen enum
- `context/AppContext.tsx`: Global state management (user, cart, wallet operations)
- `services/geminiService.ts`: AI integration logic (currently mocked with `MOCK_MEAL_PLAN`)
- `services/api/mockApiService.ts`: Mock data and API simulation with `apiDelay` function
- `types.ts`: TypeScript interfaces (User, Product, CartItem, Order, WalletTransaction, etc.)
- `features/shopping/components/AiMenuSuggestion.tsx`: AI meal planning UI with cart integration
- `features/cart/screens/CartScreen.tsx`: Cart management with checkout functionality
- `tailwind.config.js`: NativeWind configuration with content paths
- `metro.config.js`: Metro bundler config with NativeWind integration

## Dependencies & Environment
- **Expo SDK 54**: Latest Expo with React Native 0.81.5
- **NativeWind 4**: Tailwind CSS for React Native (no styled HOCs)
- **Google Generative AI**: For AI features (mocked in development)
- **Environment**: Requires `EXPO_PUBLIC_GEMINI_API_KEY` in `.env`

## Common Pitfalls
- **API Key**: Must be prefixed with `EXPO_PUBLIC_` for Expo environment variables
- **Styling**: No `styled()` HOCs - use `className` directly (NativeWind 4 migration)
- **Navigation**: Screen-based routing in `App.tsx`, no React Navigation library
- **Data**: All operations use mock data, no real persistence or backend
- **Component exports**: Use default exports for components, named exports for types in `index.ts`
- **Hook dependencies**: Always include all dependencies in `useCallback` deps arrays
- **Vietnamese text**: Ensure all user-facing strings are in Vietnamese
- **Mock delays**: AI services simulate 500-800ms delays for realistic UX testing

## Build Configuration
- **Metro config**: Uses `withNativeWind` for CSS processing with `global.css` input
- **Tailwind content**: Includes `App.tsx`, `components/`, and `features/` paths
- **Asset handling**: Expo handles assets automatically via `assetBundlePatterns`
- **TypeScript**: Strict typing with interfaces in `types.ts`