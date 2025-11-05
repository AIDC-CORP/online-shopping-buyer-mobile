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
- **Bottom navigation**: `BottomNavBar` component manages tab switching

### Styling
- **NativeWind 4**: Tailwind CSS classes directly in `className` props
- **Migration note**: Removed styled HOCs - use `className` directly (NativeWind 4 migration)
- **CSS processing**: `withNativeWind(config, { input: './global.css' })` for Metro bundler
- **Example**: `<View className="flex-1 bg-slate-100">`

### AI Integration
- **Gemini API**: Used for meal planning (`generateMealPlan`) and chatbot (`getChatbotResponse`)
- **Environment**: `EXPO_PUBLIC_GEMINI_API_KEY` required (must be prefixed with `EXPO_PUBLIC_`)
- **Mock mode**: Services use mock data with simulated delays (`apiDelay` function) for development
- **Current state**: AI services return mock responses for UI development
- **Meal planning**: AI generates meal suggestions based on user profile (age, weight, allergies, etc.)

### Data Layer
- **Mock data**: All data is mocked in `mockApiService.ts` with Vietnamese product names
- **No backend**: Pure frontend with simulated API delays (500-1000ms) for realistic UX
- **Types**: Strongly typed with TypeScript interfaces in `types.ts`
- **Family profiles**: Support for multiple family members with individual dietary preferences

### Wallet System
- **Balance tracking**: User wallet balance stored in context and persisted via mock API
- **Transactions**: Full transaction history with types: 'top_up', 'payment', 'refund'
- **Payment integration**: `deductFromWallet()` method handles order payments with balance validation
- **Top-up**: `addToWallet()` method for adding funds with transaction logging

## Development Workflow

### Setup
```bash
cp .env.example .env
# Add EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here to .env
yarn install
yarn start
```

### Testing
- **Jest setup**: Configured in `jest.config.json` with React Native preset
- **Mock styles**: CSS files mocked via `__mocks__/styleMock.js`
- **Test command**: `yarn test` runs Jest test suite
- **Current tests**: Basic App component test in `App.test.tsx`

### Common Commands
- `npx expo start -c`: Clear Metro cache when bundling fails
- `rm -rf node_modules && yarn install`: Clean reinstall for dependency issues
- `./start.sh`: Automated setup and start script (may show asset warnings)

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
addToCart(product, quantity); // Adds or increments existing items
updateCartItemQuantity(productId, 0); // Removes item from cart
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

### Screen Navigation
```tsx
// In App.tsx - custom navigation system
const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Shopping);
const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

// Navigation triggered by BottomNavBar onPress handlers
// Order details overlay other screens when selectedOrder is set
```

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
- `jest.config.json`: Jest testing configuration with style mocks

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
- **Asset warnings**: `start.sh` may show favicon errors - these are non-critical for development

## Build Configuration
- **Metro config**: Uses `withNativeWind` for CSS processing with `global.css` input
- **Tailwind content**: Includes `App.tsx`, `components/`, and `features/` paths
- **Asset handling**: Expo handles assets automatically via `assetBundlePatterns`
- **TypeScript**: Strict typing with interfaces in `types.ts`
- **Jest**: Configured for React Native testing with CSS mocking