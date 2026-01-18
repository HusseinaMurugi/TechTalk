@echo off
echo ========================================
echo    TechTalk Setup & Compatibility Check
echo ========================================
echo.

echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
) else (
    python --version
)

echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
) else (
    node --version
    npm --version
)

echo.
echo ========================================
echo Installing Backend Dependencies...
echo ========================================
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Trying alternative pip installation...
    python -m pip install -r requirements.txt
)

echo.
echo Seeding database with sample data...
python seed.py

echo.
echo ========================================
echo Installing Frontend Dependencies...
echo ========================================
cd ..\frontend
npm install

echo.
echo ========================================
echo Setup Complete! 
echo ========================================
echo.
echo To start the application:
echo 1. Open terminal 1: cd backend && start.bat
echo 2. Open terminal 2: cd frontend && start.bat
echo 3. Visit http://localhost:5173
echo.
echo Test accounts:
echo - alice@example.com / password123
echo - bob@example.com / password123
echo - charlie@example.com / password123
echo.
pause