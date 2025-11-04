#!/bin/bash

# AI Meal Planner & Grocery Assistant - Quick Start Script

echo "🚀 Starting AI Meal Planner & Grocery Assistant..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please add your EXPO_PUBLIC_GEMINI_API_KEY in .env"
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    yarn install
    echo ""
fi

# Start Expo
echo "🎉 S (NOBRIDGE) WARN  🚨 React Native's New Architecture is always enabled in Expo Go, but it is not explicitly enabled your project app config. This may lead to unexpected behavior when you create a production or development build. Set "newArchEnabled": true in your app.json.
Learn more: https://docs.expo.dev/guides/new-architecture/
Error: ENOENT: no such file or directory, open './assets/favicon.png'
    at Object.openSync (node:fs:560:18)
    at readFileSync (node:fs:444:35)
    at calculateHash (/Volumes/AIDC /Shopping Buyer/ai-meal-planner-&-grocery-assistant/node_modules/@expo/image-utils/src/Cache.ts:13:73)
    at createCacheKey (/Volumes/AIDC /Shopping Buyer/ai-meal-planner-&-grocery-assistant/node_modules/@expo/image-utils/src/Cache.ts:19:16)
    at Object.createCacheKeyWithDirectoryAsync (/Volumes/AIDC /Shopping Buyer/ai-meal-planner-&-grocery-assistant/node_modules/@expo/image-utils/src/Cache.ts:34:31)
    at generateImageAsync (/Volumes/AIDC /Shopping Buyer/ai-meal-planner-&-grocery-assistant/node_modules/@expo/image-utils/src/Image.ts:227:32)
    at processTicksAndRejections (node:internal/process/task_queues:105:5)
    at getFaviconFromExpoConfigAsync (/Volumes/AIDC /Shopping Buyer/ai-meal-planner-&-grocery-assistant/node_modules/@expo/cli/src/export/favicon.ts:83:24)
    at FaviconMiddleware.handleRequestAsync (/Volumes/AIDC /Shopping Buyer/ai-meal-planner-&-grocery-assistant/node_modules/@expo/cli/src/start/server/middleware/FaviconMiddleware.ts:29:20)
    at internalMiddleware (/Volumes/AIDC /Shopping Buyer/ai-meal-planner-&-grocery-assistant/node_modules/@expo/cli/src/start/server/middleware/ExpoMiddleware.ts:44:16)tarting Expo development server..."
yarn start
