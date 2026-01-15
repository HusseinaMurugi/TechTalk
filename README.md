# TechTalk - Social Media Platform for Tech Enthusiasts

A full-stack social media application built with FastAPI (backend) and React (frontend), designed for tech enthusiasts, developers, and students to share updates, follow each other, and engage with tech-focused content.

## Features

- **User Authentication**: Register, login with JWT-based authentication
- **Posts**: Create, edit, delete posts with optional images
- **Social Interactions**: Like/unlike posts, comment on posts
- **Follow System**: Follow/unfollow other users
- **Feed**: View posts from followed users
- **Search**: Search for users and posts
- **Notifications**: Get notified about likes, comments, and new followers
- **User Profiles**: View and edit your profile, see followers/following

## Tech Stack

### Backend
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite (Database)
- JWT (Authentication)
- Bcrypt (Password hashing)

### Frontend
- React (UI library)
- React Router (Routing)
- TailwindCSS (Styling)
- Axios (HTTP client)
- Context API (State management)

## Project Structure

```
TechTalk2/
├── backend/
│   ├── main.py           # FastAPI app with all routes
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── database.py       # Database connection
│   ├── auth.py           # Authentication utilities
│   ├── seed.py           # Seed data script
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Context providers
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── package.json      # Node dependencies
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Seed the database with example data:
```bash
python seed.py
```

5. Start the backend server:
```bash
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Test Accounts

After seeding the database, you can login with these accounts:

- **Email**: alice@example.com | **Password**: password123
- **Email**: bob@example.com | **Password**: password123
- **Email**: charlie@example.com | **Password**: password123
- **Email**: diana@example.com | **Password**: password123

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user

### Users
- `GET /profile` - Get current user profile
- `PUT /profile` - Update profile
- `GET /users/{id}` - Get user by ID
- `GET /search/users?q={query}` - Search users
- `GET /users/{id}/followers` - Get user followers
- `GET /users/{id}/following` - Get users being followed
- `GET /users/{id}/is-following` - Check if following user

### Posts
- `POST /posts` - Create post
- `GET /feed` - Get feed (posts from followed users)
- `GET /posts/{id}` - Get single post
- `GET /users/{id}/posts` - Get user's posts
- `PUT /posts/{id}` - Update post
- `DELETE /posts/{id}` - Delete post
- `GET /search/posts?q={query}` - Search posts

### Comments
- `POST /posts/{id}/comments` - Create comment
- `GET /posts/{id}/comments` - Get post comments
- `DELETE /comments/{id}` - Delete comment

### Likes
- `POST /posts/{id}/likes` - Like post
- `DELETE /posts/{id}/likes` - Unlike post

### Follow
- `POST /users/{id}/follow` - Follow user
- `DELETE /users/{id}/follow` - Unfollow user

### Notifications
- `GET /notifications` - Get notifications
- `PUT /notifications/{id}/read` - Mark notification as read
- `PUT /notifications/read-all` - Mark all as read

## Usage

1. **Register/Login**: Create an account or login with test credentials
2. **Create Posts**: Share your thoughts on the home feed
3. **Follow Users**: Search for users and follow them to see their posts
4. **Engage**: Like and comment on posts
5. **Profile**: Edit your profile, view your posts and connections
6. **Notifications**: Check notifications for interactions

## Development Notes

- Backend runs on port 8000
- Frontend runs on port 5173
- CORS is configured to allow frontend-backend communication
- JWT tokens expire after 7 days
- All passwords are hashed using bcrypt
- Database file: `backend/techtalk.db`

## Troubleshooting

**Backend won't start:**
- Ensure virtual environment is activated
- Check all dependencies are installed
- Verify Python version is 3.8+

**Frontend won't start:**
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`

**Can't login:**
- Ensure backend is running
- Check browser console for errors
- Verify API_URL in `frontend/src/utils/api.js`

**Database issues:**
- Delete `techtalk.db` and run `python seed.py` again

## Future Enhancements

- Image upload functionality
- Real-time updates with WebSockets
- Password reset via email
- Direct messaging
- Trending topics
- Post hashtags
- User mentions

## License

MIT License - Feel free to use this project for learning and development.
