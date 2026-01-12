# Quick Database Setup Guide

## ✅ Good News: PostgreSQL is Installed!

PostgreSQL is running on your system. Now we just need to set up the database.

---

## Easiest Method: Use pgAdmin (GUI Tool)

### Step 1: Open pgAdmin
1. Press `Windows Key`
2. Type "pgAdmin"
3. Click on pgAdmin 4

### Step 2: Connect to PostgreSQL
1. When pgAdmin opens, you'll see "Servers" in the left sidebar
2. Click on the server (might ask for password - use the password you set during installation)
3. If no server exists:
   - Right-click "Servers" → "Create" → "Server"
   - General tab → Name: `AniHub`
   - Connection tab:
     - Host: `localhost`
     - Port: `5432`
     - Username: `postgres`
     - Password: (your PostgreSQL password)

### Step 3: Create Database
1. Right-click "Databases" → "Create" → "Database"
2. Name: `anihub`
3. Click "Save"

### Step 4: Run Schema SQL
1. Right-click the `anihub` database → "Query Tool"
2. Open `server/database/schema.sql` in a text editor (like VS Code)
3. **Copy ALL the SQL** from that file
4. **Paste** into the Query Tool in pgAdmin
5. Click the "Execute" button (or press F5)
6. You should see "Success" message

✅ Done! Database is ready.

---

## Alternative: Use PowerShell with Full Path

If you prefer command line, use the full path to psql:

```powershell
# Create database
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE anihub;"

# Run schema (adjust path to your project)
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d anihub -f "C:\Users\Sreehari S Madhavan\Documents\Aniplace\server\database\schema.sql"
```

---

## Test Database Connection

After setting up the database, test it:

```powershell
cd server
node test-db.js
```

This will:
- ✅ Test connection
- ✅ Show PostgreSQL version
- ✅ List all tables

---

## Configure Backend

1. Make sure `.env` file exists:
   ```powershell
   cd server
   Copy-Item env.example .env
   ```

2. Edit `.env` file and update:
   ```
   DB_PASSWORD=your-postgres-password-here
   ```

3. Other settings should be fine (localhost, port 5432, database anihub)

---

## Start Testing!

Once database is set up:

1. **Start Backend:**
   ```powershell
   cd server
   npm run dev
   ```

2. **Start Frontend** (new terminal):
   ```powershell
   cd client
   npm run dev
   ```

3. **Test Registration:**
   - Open http://localhost:5173
   - Click "Register"
   - Create an account
   - Should work! 🎉

---

## Need Help?

- **Can't find pgAdmin?** Check Start menu or install it separately
- **Forgot password?** You'll need to reset PostgreSQL password (see PostgreSQL docs)
- **Connection errors?** Check `.env` file has correct password
- **Still stuck?** Use Railway or Render for cloud PostgreSQL (see WINDOWS_SETUP.md)
