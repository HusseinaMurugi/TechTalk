# TechTalk Testing Checklist

## 🧪 Local Testing Steps:

### 1. Setup & Start
- [ ] Run `setup.bat` (first time only)
- [ ] Start backend: `cd backend && start.bat`
- [ ] Start frontend: `cd frontend && start.bat`
- [ ] Visit http://localhost:5173

### 2. Authentication & Styling
- [ ] Forgot password page has proper white card styling
- [ ] Profile setup modal has black text in white container
- [ ] Login/register pages have consistent background

### 3. Search Functionality
- [ ] Navbar search shows suggestions (users, hashtags, posts)
- [ ] Explore page has NO search bar
- [ ] Search suggestions are clickable and work

### 4. Profile & Edit Modal
- [ ] Click "Edit Profile" opens comprehensive modal
- [ ] Modal has 6 sections: Basic, Appearance, Account, Interests, Preferences, Advanced
- [ ] Save/Discard buttons work properly
- [ ] Profile shows 3 tabs: Posts, Reposts, Tagged Posts

### 5. Messages Enhancement
- [ ] Messages page has "+" button for new conversations
- [ ] Can search and select any user to message
- [ ] Time stamps show exact times (not "3 hours ago")

### 6. Post Actions
- [ ] Posts have 4 buttons: Like, Comment, Repost, Report
- [ ] Repost button toggles and updates count
- [ ] Report button shows modal with reasons
- [ ] All buttons work without errors

### 7. Mentions & Tagging
- [ ] Type @username in posts to mention users
- [ ] @mentions appear as green clickable links
- [ ] Mentioned users get notifications
- [ ] Tagged Posts tab shows posts with @mentions

### 8. Notifications
- [ ] Notifications are clickable
- [ ] Follow notifications → User profile
- [ ] Like/Comment/Repost notifications → Specific post
- [ ] Notifications auto-mark as read when clicked
- [ ] Each notification type has proper icon

## 🚀 Deployment Checklist:

### Backend (Render)
- [ ] Migration script runs successfully
- [ ] All API endpoints respond correctly
- [ ] Database schema updated properly
- [ ] CORS allows frontend domain

### Frontend (Vercel)
- [ ] Environment variable `VITE_API_URL` set correctly
- [ ] All routes work properly
- [ ] No console errors
- [ ] API calls reach backend successfully

## 🔧 Test Accounts:
- alice@example.com / password123
- bob@example.com / password123
- charlie@example.com / password123

## 🐛 Common Issues to Check:
- [ ] No 404 errors on page refresh
- [ ] Images load properly
- [ ] Mobile responsiveness works
- [ ] All modals close properly
- [ ] Search results are accurate