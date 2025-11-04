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
│   └── components/             # Screen-specific components
```

### Styling
- **NativeWind 4**: Tailwind CSS classes directly in `className` props
- **No styled HOCs**: Use `className` directly on React Native components
- **Example**: `<View className="flex-1 bg-slate-100">`

### AI Integration
- **Gemini API**: Used for meal planning (`generateMealPlan`) and chatbot (`getChatbotResponse`)
- **Environment**: `EXPO_PUBLIC_GEMINI_API_KEY` required
- **Error handling**: Graceful fallbacks with user-friendly Vietnamese messages

### Data Layer
- **Mock data**: All data is mocked in `mockApiService.ts`
- **No backend**: Pure frontend with simulated API delays
- **Types**: Strongly typed with TypeScript interfaces in `types.ts`

## Development Workflow

### Setup
```bash
cp .env.example .env
# Add EXPO_PUBLIC_GEMINI_API_KEY to .env
npm install
npm start
```

### Testing
- **Expo Go**: Scan QR code for physical device testing
- **Emulators**: `npm run ios` / `npm run android`
- **Web**: `npm run web` (experimental)

### Common Commands
- `npx expo start -c`: Clear Metro cache
- `rm -rf node_modules && npm install`: Clean reinstall

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

## Key Files Reference

- `App.tsx`: Main navigation and screen routing
- `context/AppContext.tsx`: Global state management
- `services/geminiService.ts`: AI integration logic
- `services/mockApiService.ts`: Mock data and API simulation
- `types.ts`: TypeScript interfaces
- `features/shopping/components/AiMenuSuggestion.tsx`: AI meal planning UI
- `tailwind.config.js`: NativeWind configuration

## Vietnamese Localization
- **UI Language**: All user-facing text in Vietnamese
- **Code Comments**: Mix of English and Vietnamese
- **Data**: Mock data includes Vietnamese product names

## Dependencies & Environment
- **Expo SDK 52**: Latest Expo with React Native 0.76.5
- **NativeWind 4**: Tailwind CSS for React Native
- **Google Generative AI**: For AI features
- **Environment**: Requires Gemini API key in `.env`

## Common Pitfalls
- **API Key**: Must be prefixed with `EXPO_PUBLIC_` for Expo
- **Styling**: No `styled()` HOCs - use `className` directly
- **Navigation**: Screen-based routing in `App.tsx`, no React Navigation
- **Data**: All operations use mock data, no real persistence