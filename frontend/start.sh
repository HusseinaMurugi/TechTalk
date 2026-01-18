#!/bin/bash

echo "🚀 Starting TechTalk Frontend..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start development server
echo "Starting React app on http://localhost:5173"
npm run dev
