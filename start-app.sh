#!/bin/bash

echo "🚀 Starting TechTalk Application..."
echo ""

# Check if backend is already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Backend already running on port 8000"
else
    echo "📦 Starting Backend..."
    cd techtalk-backend
    
    # Activate virtual environment if it exists
    if [ -d "venv" ]; then
        source venv/bin/activate
    else
        echo "Creating virtual environment..."
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    fi
    
    # Start backend in background
    uvicorn main:app --reload &
    BACKEND_PID=$!
    echo "✅ Backend started (PID: $BACKEND_PID) on http://localhost:8000"
    cd ..
fi

sleep 2

# Check if frontend is already running
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Frontend already running on port 5173"
else
    echo "📦 Starting Frontend..."
    cd techtalk-frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    # Start frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ Frontend started (PID: $FRONTEND_PID) on http://localhost:5173"
    cd ..
fi

echo ""
echo "🎉 TechTalk is running!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
wait
