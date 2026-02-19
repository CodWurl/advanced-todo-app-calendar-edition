
# Advanced Todo App v3 - Calendar Scheduler Edition

This project demonstrates proficiency in modern web development, including frontend frameworks, backend APIs, database design, authentication, containerization, and UI/UX design principles.

## ✨ New Features

### Beautiful Modern UI
- 🎨 **Gradient background** with purple/violet theme
- 📅 **Interactive monthly calendar** with task indicators
- ✅ **Task completion** with checkboxes and visual feedback
- 📱 **Fully responsive** design for all screen sizes
- 🎯 **Today's tasks** quick-access section
- 📆 **Upcoming tasks** with date sorting
- 🗓️ **Date-specific view** when clicking calendar days
- 💫 **Smooth animations** and modern glassmorphism effects

### Core Features
- JWT Auth with Login/Register
- Role Based Access
- CRUD Tasks with dates
- Task scheduling with calendar
- React Dashboard
- Protected Routes
- Docker + PostgreSQL

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL (or Docker)

### Option 1: Using Docker (Recommended for beginners)

```bash
# 1. Navigate to backend
cd backend

# 2. Copy environment file
cp .env.example .env

# 3. Start database with Docker
docker-compose up -d

# 4. Install dependencies and start server
npm install
npm start

# 5. In a new terminal, start frontend
cd ../frontend
npm install
npm run dev
```

### Option 2: Using Local PostgreSQL

```bash
# 1. Navigate to backend
cd backend

# 2. Run the setup script (Mac/Linux)
chmod +x setup-db.sh
./setup-db.sh

# Or manually create database:
psql -U postgres -c "CREATE DATABASE todoapp;"
psql -U postgres -d todoapp -f sql/schema.sql

# 3. Copy and configure .env
cp .env.example .env
# Edit .env and set your PostgreSQL password in DATABASE_URL

# 4. Install dependencies and start server
npm install
npm start

# 5. In a new terminal, start frontend
cd ../frontend
npm install
npm run dev
```

### 3. Access the App

Open http://localhost:3000 (or http://localhost:5173)

## ❗ Common Issues

### Login/Register Errors?

See **LOGIN_DEBUG_GUIDE.md** for comprehensive troubleshooting.

**Quick checks:**
1. Is the backend running? You should see "✅ Backend running on port 5000"
2. Is PostgreSQL running and database created?
3. Test: `curl http://localhost:5000/api/health` (should return `{"status":"ok"}`)
4. Check browser console (F12) for error messages
5. Did you create .env file in backend directory?

**Most common fix:**
```bash
# Make sure .env exists
cd backend
cp .env.example .env

# Make sure database exists
psql -U postgres -c "CREATE DATABASE todoapp;"
psql -U postgres -d todoapp -f sql/schema.sql

# Restart backend
npm start
```

### Blank Screen?

See **TROUBLESHOOTING.md** for detailed steps.

**Quick fix:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📸 UI Preview

The app features:
- **Login Page**: Beautiful centered login card with gradient background
- **Dashboard**: Two-column layout with tasks list and calendar
- **Calendar View**: Interactive monthly calendar showing tasks per day
- **Task Management**: Add tasks with dates, mark complete, delete
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🎨 Customization

You can change the background gradient in `/frontend/src/styles/Dashboard.css`:

```css
/* Current purple gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Other beautiful options (uncomment to use): */
/* Pink gradient */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Blue gradient */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Green gradient */
background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
```

## 🛠️ Technology Stack

**Frontend:**
- React 18 with Hooks
- React Router for navigation
- Vite for fast development
- Custom CSS (no UI framework needed!)
- JWT decode for auth

**Backend:**
- Node.js & Express
- PostgreSQL database
- JWT authentication
- bcrypt password hashing

## 📝 Usage

1. **Register/Login**: Create an account or login
2. **Add Tasks**: Enter task title and select a due date
3. **View Calendar**: Click on any date to see tasks for that day
4. **Complete Tasks**: Check the checkbox to mark as complete
5. **Delete Tasks**: Click the × button to remove tasks

## 🐛 Troubleshooting

**Error when logging in?** → See LOGIN_DEBUG_GUIDE.md

**Blank screen?** → See TROUBLESHOOTING.md

**UI design info?** → See UI_FEATURES.md

**Backend won't start?**
- Check .env file exists
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running

**Frontend won't start?**
- Run `npm install` in frontend directory
- Check Node.js version (needs 18+)

## 📚 Documentation

- `LOGIN_DEBUG_GUIDE.md` - Complete guide for login/register errors
- `TROUBLESHOOTING.md` - General troubleshooting steps
- `UI_FEATURES.md` - UI customization and design details

## 🔧 Environment Variables

Backend `.env` file:
```
PORT=5000
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/todoapp
JWT_SECRET=change-this-to-a-random-secret-key
```

For Docker, use:
```
DATABASE_URL=postgres://postgres:postgres@db:5432/todoapp
```
--Note for starting Postgres Database in PowerShell 

Stop Database:
powershellcd C:\Users\lou-s\OneDrive\Desktop\advanced-todo-app-calendar-edition\backend
docker-compose down

To Start Everything Again Later:
powershell# Terminal 1 - Backend
cd C:\Users\lou-s\OneDrive\Desktop\advanced-todo-app-calendar-edition\backend
docker-compose up -d
npm start

# Terminal 2 - Frontend
cd C:\Users\lou-s\OneDrive\Desktop\advanced-todo-app-calendar-edition\frontend
npm run dev