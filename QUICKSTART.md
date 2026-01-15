# TechTalk Quick Start Guide

## Fastest Way to Run the App

### Option 1: Using Start Scripts (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
./start.sh
```

**Terminal 2 - Frontend:**
```bash
cd frontend
./start.sh
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Test Login

Use any of these accounts:
- alice@example.com / password123
- bob@example.com / password123
- charlie@example.com / password123
- diana@example.com / password123

## What You Can Do

1. ✅ Register new account or login
2. ✅ Create posts with text
3. ✅ Like/unlike posts
4. ✅ Comment on posts
5. ✅ Follow/unfollow users
6. ✅ Search users and posts
7. ✅ View notifications
8. ✅ Edit your profile
9. ✅ View other user profiles

## Troubleshooting

**Port already in use:**
- Backend: Change port with `uvicorn main:app --reload --port 8001`
- Frontend: Change port in vite.config.js

**Database issues:**
- Delete `backend/techtalk.db` and run `python seed.py` again

**Module not found:**
- Backend: Ensure virtual environment is activated
- Frontend: Run `npm install` again

## Project Structure

```
TechTalk2/
├── backend/          # FastAPI backend
│   ├── main.py      # All API routes
│   ├── models.py    # Database models
│   ├── auth.py      # JWT authentication
│   └── seed.py      # Sample data
├── frontend/         # React frontend
│   └── src/
│       ├── pages/   # Page components
│       ├── components/ # Reusable components
│       └── context/ # Global state
└── README.md        # Full documentation
```

Enjoy TechTalk! 🚀
