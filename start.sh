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
    npm install
    echo ""
fi

# Start Expo
echo "🎉 Starting Expo development server..."
npm start
