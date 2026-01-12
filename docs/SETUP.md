# Setup Guide

This guide will help you set up the AniHub project on your local machine.

## Prerequisites

Before starting, make sure you have installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Download from: https://www.postgresql.org/download/
   - Or use a managed service (Railway, Render, etc.)
   - Verify: `psql --version`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

---

## Step 1: Clone/Download Project

If using Git:
```bash
git clone <repository-url>
cd anihub
```

Or download and extract the project folder.

---

## Step 2: Set Up Backend

### 2.1 Install Dependencies

```bash
cd server
npm install
```

### 2.2 Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file with your settings:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   
   # Generate a JWT secret (run this command):
   # node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   JWT_SECRET=paste-your-generated-secret-here
   
   # Database settings (adjust to your PostgreSQL setup)
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=anihub
   DB_USER=postgres
   DB_PASSWORD=your-password-here
   ```

### 2.3 Set Up Database

1. Create PostgreSQL database:
   ```bash
   psql -U postgres
   ```
   
   Then in PostgreSQL:
   ```sql
   CREATE DATABASE anihub;
   \q
   ```

2. Run the schema (see `docs/DB_SCHEMA.md` for SQL):
   - Copy the CREATE TABLE statements
   - Run them in your PostgreSQL client or command line

### 2.4 Test Backend

Start the server:
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📍 Health check: http://localhost:5000/api/health
```

Test it:
- Open browser: http://localhost:5000/api/health
- Should see: `{"status":"ok","message":"AniHub API is running"}`

---

## Step 3: Set Up Frontend

### 3.1 Install Dependencies

Open a new terminal:
```bash
cd client
npm install
```

### 3.2 Set Up Environment Variables (Optional)

Create `.env` file in `client/` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

(If you don't create this, it defaults to `http://localhost:5000/api`)

### 3.3 Start Frontend

```bash
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser.

---

## Step 4: Verify Everything Works

1. **Backend**: http://localhost:5000/api/health ✅
2. **Frontend**: http://localhost:5173 ✅
3. **Navigation**: Click around the app - all pages should load

---

## Common Issues

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**: Change `PORT` in `server/.env` to a different number (e.g., 5001)

### Database Connection Error

**Error**: `Connection refused` or `password authentication failed`

**Solutions**:
1. Make sure PostgreSQL is running
2. Check `.env` file has correct database credentials
3. Verify database exists: `psql -U postgres -l`

### CORS Error

**Error**: `CORS policy blocked`

**Solution**: Make sure `FRONTEND_URL` in `server/.env` matches your frontend URL (usually `http://localhost:5173`)

### Module Not Found

**Error**: `Cannot find module 'xyz'`

**Solution**: Run `npm install` in the appropriate folder (server or client)

---

## Development Workflow

### Running Both Frontend and Backend

You need **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Making Changes

- **Frontend changes**: Automatically reload (Hot Module Replacement)
- **Backend changes**: Automatically restart (nodemon)
- **Database changes**: Restart backend after running SQL

---

## Next Steps

Once setup is complete:

1. ✅ Read `docs/ARCHITECTURE.md` - Understand the system
2. ✅ Read `docs/DB_SCHEMA.md` - Understand the database
3. 🚀 Start building features! (Authentication first)

---

## Getting Help

- Check the documentation in `docs/` folder
- Review error messages carefully
- Check that all services are running
- Verify environment variables are set correctly
