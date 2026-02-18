# Todo App - Troubleshooting Guide

## Issues Found & Fixed

### 1. Missing Vite Configuration (CRITICAL)
**Problem**: The frontend was missing `vite.config.js`, which is required for Vite to process React/JSX files.

**Solution**: Created `vite.config.js` with:
- React plugin configuration
- Dev server settings on port 3000
- Proxy configuration for API calls

### 2. Missing React Plugin Dependency
**Problem**: `@vitejs/plugin-react` was not in package.json

**Solution**: Added `@vitejs/plugin-react` to devDependencies

### 3. Incomplete HTML Structure
**Problem**: index.html was missing charset, viewport, and title tags

**Solution**: Added proper HTML head section

## Steps to Get Your App Running

### 1. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Set Up Database
Make sure you have PostgreSQL running and create the database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE todo_app;

# Exit psql
\q

# Run the schema
psql -U postgres -d todo_app -f backend/sql/schema.sql
```

### 4. Configure Backend Environment
Create a `.env` file in the backend directory:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=todo_app
JWT_SECRET=your-secret-key-here
```

### 5. Start the Backend
```bash
cd backend
npm start
```

### 6. Start the Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

### 7. Access the Application
Open your browser to: http://localhost:3000

## Common Issues & Solutions

### Blank Screen Checklist:

1. **Check Browser Console**
   - Press F12 to open Developer Tools
   - Look for errors in the Console tab
   - Common errors:
     - "Failed to fetch" → Backend not running
     - "Unexpected token" → JSX not being transpiled (missing vite config)
     - React errors → Component issues

2. **Verify Backend is Running**
   - Should see "Server running on port 5000" message
   - Test API: `curl http://localhost:5000/api/auth/login`

3. **Check Network Tab**
   - Open DevTools → Network tab
   - Refresh the page
   - Verify main.jsx is loading
   - Check if API calls are being made

4. **Database Connection**
   - Ensure PostgreSQL is running
   - Verify database credentials in .env
   - Check if tables were created

### JWT Token Issues:

The app might show a blank screen if:
- There's an expired token in localStorage
- Token is malformed

**Solution**: Open browser console and run:
```javascript
localStorage.clear()
```
Then refresh the page - you should see the login page.

### Port Conflicts:

If ports 3000 or 5000 are in use:

**Frontend**: Change port in vite.config.js
```javascript
server: {
  port: 3001, // or any available port
}
```

**Backend**: Change PORT in .env file

## Expected Behavior

1. **First Visit**: Should redirect to `/login`
2. **After Login**: Should redirect to `/` (Dashboard)
3. **Dashboard**: Shows list of tasks

## Testing the Fix

After making the changes above:

1. Clear browser cache and localStorage
2. Install dependencies: `npm install` in both frontend and backend
3. Start both servers
4. Visit http://localhost:3000
5. You should see the login page (not a blank screen)

## Additional Debugging Tips

### Enable Detailed Logging

Add console.logs to trace the issue:

**In main.jsx**:
```javascript
console.log('App starting...');
ReactDOM.createRoot(document.getElementById("root")).render(
  // ... rest of code
);
console.log('App rendered');
```

**In AuthContext.jsx**:
```javascript
export function AuthProvider({children}){
  console.log('AuthProvider mounted');
  const [token,setToken] = useState(localStorage.getItem("token"));
  console.log('Token from localStorage:', token);
  // ... rest of code
}
```

### Check Vite is Working

When you run `npm run dev`, you should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

If Vite doesn't start, check for:
- Node.js version (should be 18+)
- npm version
- Port conflicts

## Files Modified/Created

✅ Created: `frontend/vite.config.js`
✅ Modified: `frontend/package.json` (added React plugin)
✅ Modified: `frontend/index.html` (added proper HTML structure)

## Next Steps

Once the app is rendering:

1. Create a test user account
2. Test login functionality
3. Test task CRUD operations
4. Check for any console errors during use

If you're still seeing a blank screen after these fixes, please check:
- Browser console for specific errors
- Network tab for failed requests
- Backend logs for database connection issues
