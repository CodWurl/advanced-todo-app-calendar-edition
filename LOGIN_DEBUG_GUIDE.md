# Login/Register Error Debugging Guide

## Common Errors and Solutions

### 1. Database Connection Errors

**Symptoms:**
- "Connection refused" error
- "ECONNREFUSED" in console
- "Cannot connect to database"

**Solutions:**

#### If using Docker:
```bash
# Check if database container is running
docker ps

# If not running, start it:
cd backend
docker-compose up -d

# Check logs:
docker-compose logs db
```

#### If using local PostgreSQL:
```bash
# Check if PostgreSQL is running
# On Mac:
brew services list

# On Linux:
sudo systemctl status postgresql

# Start PostgreSQL if needed
# On Mac:
brew services start postgresql

# On Linux:
sudo systemctl start postgresql
```

### 2. Missing Database or Tables

**Symptoms:**
- "relation 'users' does not exist"
- "Database 'todoapp' does not exist"

**Solutions:**

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE todoapp;"

# Run the schema
psql -U postgres -d todoapp -f backend/sql/schema.sql

# Verify tables were created
psql -U postgres -d todoapp -c "\dt"
```

### 3. Environment Variables Not Set

**Symptoms:**
- "JWT_SECRET is not defined"
- Backend crashes on startup
- No error message but login fails

**Solutions:**

1. **Create .env file in backend directory:**
```bash
cd backend
cp .env.example .env
```

2. **Edit .env file with your settings:**

For Docker:
```
PORT=5000
DATABASE_URL=postgres://postgres:postgres@db:5432/todoapp
JWT_SECRET=your-secret-key-here-change-this
```

For local PostgreSQL:
```
PORT=5000
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/todoapp
JWT_SECRET=your-secret-key-here-change-this
```

3. **Restart the backend after changing .env**

### 4. CORS Errors

**Symptoms:**
- "CORS policy" error in browser console
- "Access-Control-Allow-Origin" error
- Network request blocked

**Solutions:**

The updated server.js should fix this, but if you still have issues:

1. **Check frontend is running on correct port**
   - Vite usually runs on port 5173 or 3000
   - Check terminal output when you run `npm run dev`

2. **Update CORS origins in server.js:**
```javascript
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:YOUR_PORT"],
  credentials: true
}));
```

### 5. API Endpoint Mismatch

**Symptoms:**
- 404 errors in Network tab
- "Route not found"

**Solutions:**

1. **Check your API base URL in frontend/src/utils/api.js:**
```javascript
export default axios.create({ baseURL: "http://localhost:5000/api" });
```

2. **Verify backend is running on that port:**
```bash
# Should see: "Backend running on port 5000"
```

3. **Test the health endpoint:**
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 6. Password Too Short

**Symptom:**
- "Password must be at least 6 characters"

**Solution:**
- Use a password with at least 6 characters

### 7. Email Already Registered

**Symptom:**
- "Email already registered" when trying to register

**Solutions:**

1. **Use the Login mode instead of Register**

2. **Or delete the existing user and re-register:**
```bash
psql -U postgres -d todoapp
DELETE FROM users WHERE email = 'your@email.com';
\q
```

## Step-by-Step Debugging Process

### Step 1: Check Backend is Running

```bash
cd backend
npm start
```

**Expected output:**
```
✅ Backend running on port 5000
📊 Health check: http://localhost:5000/api/health
🔐 Auth endpoint: http://localhost:5000/api/auth
📝 Tasks endpoint: http://localhost:5000/api/tasks
```

**If you see errors:**
- Read the error message carefully
- Check database connection
- Verify .env file exists and is configured

### Step 2: Test Health Endpoint

```bash
curl http://localhost:5000/api/health
```

**Expected:** `{"status":"ok","timestamp":"..."}`

**If fails:** Backend not running or port blocked

### Step 3: Check Frontend is Running

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Step 4: Open Browser Developer Tools

1. Press **F12** or **Right-click → Inspect**
2. Go to **Console** tab
3. Try to login/register
4. Look for error messages

**Common error messages and meanings:**

- **"Network Error"** → Backend not running or wrong URL
- **"401 Unauthorized"** → Wrong email/password
- **"500 Internal Server Error"** → Backend crashed (check backend console)
- **"CORS error"** → CORS configuration issue
- **"404 Not Found"** → Wrong API endpoint

### Step 5: Check Network Tab

1. Open **Network** tab in DevTools
2. Try to login/register
3. Look for the request to `/api/auth/login` or `/api/auth/register`
4. Click on it to see:
   - **Request URL:** Should be `http://localhost:5000/api/auth/login`
   - **Status Code:** 
     - 200/201 = Success
     - 400 = Bad request (check request payload)
     - 401 = Wrong credentials
     - 500 = Server error (check backend console)
   - **Response:** Shows the error message

### Step 6: Check Backend Console

Look at your backend terminal for logs:

**Good logs:**
```
POST /api/auth/register
```

**Error logs:**
```
Register error: Error: connect ECONNREFUSED 127.0.0.1:5432
```

This tells you exactly what's wrong!

## Testing the API Manually

You can test the API without the frontend:

### Test Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Expected response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Quick Fixes Checklist

- [ ] PostgreSQL is running
- [ ] Database `todoapp` exists
- [ ] Tables created (run schema.sql)
- [ ] .env file exists in backend directory
- [ ] .env has correct DATABASE_URL
- [ ] .env has JWT_SECRET set
- [ ] Backend is running on port 5000
- [ ] Frontend is running (port 3000 or 5173)
- [ ] No other app using port 5000
- [ ] Browser can reach http://localhost:5000/api/health

## Still Having Issues?

1. **Clear browser cache and localStorage:**
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

2. **Restart everything:**
```bash
# Kill all processes
# Then restart:
cd backend && npm start
# In another terminal:
cd frontend && npm run dev
```

3. **Check the exact error message** and search for it in this guide

4. **Enable verbose logging** by checking both:
   - Backend terminal output
   - Browser console (F12)
   - Browser Network tab (F12 → Network)

## Contact/Debug Info to Share

If you need help, provide:
1. Exact error message from browser console
2. Backend terminal output
3. Response from: `curl http://localhost:5000/api/health`
4. Your .env configuration (hide actual secrets)
5. Operating system (Mac/Windows/Linux)
6. How you're running the database (Docker/local PostgreSQL)
