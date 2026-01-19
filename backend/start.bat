@echo off
echo Starting TechTalk Backend...
echo.

REM Install dependencies if needed
echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install dependencies. Trying with python -m pip...
    python -m pip install -r requirements.txt
)

echo.
echo Running database migration...
python migrate.py

echo.
echo Seeding database...
python seed.py

echo.
echo Starting FastAPI server...
uvicorn main:app --reload --host 0.0.0.0 --port 8000