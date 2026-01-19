TechTalk – Social Media Platform for Tech Enthusiasts

TechTalk is a full-stack social media web application designed for developers, tech enthusiasts, and students to share updates, follow each other, and engage with tech-focused content. The application features a React frontend and a FastAPI backend.

📝 Features

User Authentication: Register and login with JWT-based authentication.

Feed: Public and personalized feeds for posts.

Trending Section: View trending tags and users.

Follow System: Follow and unfollow other users.

Responsive Design: Works seamlessly across desktop and mobile devices.

Tech-Themed UI: Dark modern theme with smooth interactions.

🛠 Tech Stack

Frontend: React, Vite, Tailwind CSS, Axios, React Router.

Backend: FastAPI, SQLAlchemy, Python-JOSE (JWT), Uvicorn.

Database: SQLite (or PostgreSQL for production).

Deployment: Render (backend) + Vercel (frontend).

⚡ Setup & Installation
1. Clone the repository
git clone https://github.com/HusseinaMurugi/TechTalk.git
cd TechTalk

2. Backend Setup
cd backend   # or wherever your main.py is located
python -m venv venv
source venv/bin/activate    # Linux/Mac
# OR
venv\Scripts\activate       # Windows
pip install -r requirements.txt

2a. Configure environment variables

Create a .env file in the backend folder:

DATABASE_URL=sqlite:///./db.sqlite3
SECRET_KEY=your_jwt_secret_key

3. Run the backend
uvicorn main:app --reload


The API will run at http://127.0.0.1:8000

Test it by opening http://127.0.0.1:8000/docs in your browser.

4. Frontend Setup
cd ../frontend
npm install

4a. Configure environment variables

Create a .env file in the frontend folder:

VITE_API_URL=http://127.0.0.1:8000

5. Run the frontend
npm run dev


The frontend will run at http://localhost:5173

🚀 Deployment

Backend: Deployed on Render → https://techtalk-np6x.onrender.com

Frontend: Deployed on Vercel → https://tech-talk.vercel.app

Make sure the frontend VITE_API_URL points to the live backend URL in production.

⚠️ Common Issues

CORS Errors: Ensure your backend allows requests from your frontend domain.

Environment Variables: Make sure .env files are correctly configured for both backend and frontend.

Python Version: Backend uses Python 3.13+.

Node Version: Frontend works with Node.js 20+.

📚 Folder Structure
TechTalk/
├─ backend/
│  ├─ main.py
│  ├─ models/
│  ├─ routes/
│  ├─ schemas/
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  ├─ public/
│  ├─ package.json
│  ├─ vite.config.js
│  └─ .env
└─ README.md


📄 License

This project is licensed under the MIT License. See the LICENSE file for details.