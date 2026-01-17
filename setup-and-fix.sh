#!/bin/bash

echo "🔧 TechTalk - Complete Setup & Fix Script"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend Setup
echo "📦 Setting up Backend..."
cd techtalk-backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "Installing backend dependencies..."
pip install -q -r requirements.txt

echo -e "${GREEN}✓ Backend setup complete${NC}"
cd ..

# Frontend Setup
echo ""
echo "📦 Setting up Frontend..."
cd techtalk-frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

# Ensure all required packages are installed
echo "Verifying all packages..."
npm install -D tailwindcss postcss autoprefixer 2>/dev/null
npm install lucide-react date-fns axios react-router-dom 2>/dev/null

echo -e "${GREEN}✓ Frontend setup complete${NC}"

# Build test
echo ""
echo "🧪 Testing build..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    npm run build
    exit 1
fi

cd ..

echo ""
echo -e "${GREEN}=========================================="
echo "✅ All setup complete!"
echo "==========================================${NC}"
echo ""
echo "🚀 To start the app:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd techtalk-backend"
echo "  source venv/bin/activate"
echo "  uvicorn main:app --reload"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd techtalk-frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
