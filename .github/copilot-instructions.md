# AI Coding Agent Instructions - AI Meal Planner & Grocery Assistant

## Project Overview
This is a React Native Expo app that provides AI-powered meal planning and grocery shopping assistance. The app uses Gemini AI for personalized meal recommendations and integrates with a shopping cart system.

## Architecture & Key Patterns

### State Management
- **Context-based**: Uses `AppContext` for global state (user, cart)
- **Local state**: Component-level state with `useState` hooks
- **Performance**: Heavy use of `useCallback` for memoization

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

### Styling
- **NativeWind 4**: Tailwind CSS classes directly in `className` props
- **No styled HOCs**: Use `className` directly on React Native components
- **Example**: `<View className="flex-1 bg-slate-100">`

### AI Integration
- **Gemini API**: Used for meal planning (`generateMealPlan`) and chatbot (`getChatbotResponse`)
- **Environment**: `EXPO_PUBLIC_GEMINI_API_KEY` required
- **Error handling**: Graceful fallbacks with user-friendly Vietnamese messages
- **Mock mode**: Services use mock data with simulated delays for development

### Data Layer
- **Mock data**: All data is mocked in `mockApiService.ts`
- **No backend**: Pure frontend with simulated API delays (`apiDelay` function)
- **Types**: Strongly typed with TypeScript interfaces in `types.ts`

## Development Workflow

### Setup
```bash
cp .env.example .env
# Add EXPO_PUBLIC_GEMINI_API_KEY to .env
yarn install
yarn start
```

### Testing
- **Expo Go**: Scan QR code for physical device testing
- **Emulators**: `yarn ios` / `yarn android`
- **Web**: `yarn web` (experimental)

### Common Commands
- `npx expo start -c`: Clear Metro cache
- `rm -rf node_modules && yarn install`: Clean reinstall
- `./start.sh`: Automated setup and start script

## Code Patterns & Conventions

### Component Structure
```tsx
const ComponentName: React.FC = () => {
  const [state, setState] = useState(initialValue);
  const { contextValue } = useAppContext();

  const memoizedCallback = useCallback(() => {
    // Implementation
  }, [dependencies]);

  return (
    <View className="styles">
      {/* JSX */}
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
    setError(error.message);
  } finally {
    setLoading(false);
  }
}, [user]);
```

### Cart Operations
```tsx
const { addToCart, removeFromCart, updateCartItemQuantity } = useAppContext();
// Use these methods for cart management
```

### Feature Organization
- **Index exports**: Each feature has `index.ts` for type exports
- **Hook naming**: `useFeatureName.ts` for custom hooks
- **Component naming**: PascalCase for components, camelCase for hooks

## Key Files Reference

- `App.tsx`: Main navigation and screen routing with custom Screen enum
- `context/AppContext.tsx`: Global state management (user, cart operations)
- `services/geminiService.ts`: AI integration logic (currently mocked)
- `services/api/mockApiService.ts`: Mock data and API simulation with `apiDelay`
- `types.ts`: TypeScript interfaces (User, Product, CartItem, Order, etc.)
- `features/shopping/components/AiMenuSuggestion.tsx`: AI meal planning UI
- `tailwind.config.js`: NativeWind configuration with content paths
- `metro.config.js`: Metro bundler config with NativeWind integration

## Vietnamese Localization
- **UI Language**: All user-facing text in Vietnamese
- **Code Comments**: Mix of English and Vietnamese
- **Data**: Mock data includes Vietnamese product names and messages

## Dependencies & Environment
- **Expo SDK 52**: Latest Expo with React Native 0.76.5
- **NativeWind 4**: Tailwind CSS for React Native
- **Google Generative AI**: For AI features (mocked in development)
- **Environment**: Requires `EXPO_PUBLIC_GEMINI_API_KEY` in `.env`

## Common Pitfalls
- **API Key**: Must be prefixed with `EXPO_PUBLIC_` for Expo environment variables
- **Styling**: No `styled()` HOCs - use `className` directly (removed in NativeWind 4 migration)
- **Navigation**: Screen-based routing in `App.tsx`, no React Navigation library
- **Data**: All operations use mock data, no real persistence or backend
- **Component exports**: Use default exports for components, named exports for types in `index.ts`
- **Hook dependencies**: Always include all dependencies in `useCallback` deps arrays

## Build Configuration
- **Metro config**: Uses `withNativeWind` for CSS processing
- **Tailwind content**: Includes `App.tsx`, `components/`, and `features/` paths
- **Asset handling**: Expo handles assets automatically via `assetBundlePatterns`