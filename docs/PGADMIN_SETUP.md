# pgAdmin Setup Guide - Step by Step

Follow these steps to set up your database using pgAdmin.

---

## Step 1: Open pgAdmin

1. Press `Windows Key` on your keyboard
2. Type "pgAdmin"
3. Click on **pgAdmin 4** (it might take a few seconds to open)

---

## Step 2: Connect to PostgreSQL Server

When pgAdmin opens, you'll see a left sidebar with "Servers".

### If you see a server already listed:
1. Click on the server name (might be "PostgreSQL 18" or similar)
2. It will ask for your PostgreSQL password
3. Enter the password you set during PostgreSQL installation
4. Check "Save password" if you want (optional)
5. Click "OK"

### If you don't see a server:
1. Right-click on **"Servers"** in the left sidebar
2. Click **"Create"** → **"Server..."**

3. In the **"General"** tab:
   - **Name**: `AniHub` (or any name you like)

4. Click the **"Connection"** tab:
   - **Host name/address**: `localhost`
   - **Port**: `5432`
   - **Maintenance database**: `postgres`
   - **Username**: `postgres`
   - **Password**: (enter your PostgreSQL password)
   - Check **"Save password"** (optional)

5. Click **"Save"**

---

## Step 3: Create the Database

1. In the left sidebar, expand your server (click the arrow next to it)
2. Right-click on **"Databases"**
3. Click **"Create"** → **"Database..."**

4. In the **"General"** tab:
   - **Database**: `anihub` (must be lowercase)
   - **Owner**: Leave as `postgres` (default)

5. Click **"Save"**

You should now see `anihub` listed under Databases! ✅

---

## Step 4: Run the Schema SQL

1. In the left sidebar, expand **"Databases"**
2. Right-click on **"anihub"** database
3. Click **"Query Tool"** (or press `Alt+Shift+Q`)

A new tab will open with a query editor.

4. **Open the schema file**:
   - Open VS Code or any text editor
   - Navigate to: `server/database/schema.sql`
   - Open that file
   - **Select ALL** the text (Ctrl+A)
   - **Copy** it (Ctrl+C)

5. **Paste into Query Tool**:
   - Click in the Query Tool window in pgAdmin
   - **Paste** the SQL (Ctrl+V)

6. **Execute the SQL**:
   - Click the **"Execute"** button (looks like a play button ▶️)
   - OR press **F5**
   - OR click the **"Execute"** button in the toolbar

7. **Check for success**:
   - Look at the bottom of the Query Tool window
   - You should see: **"Query returned successfully"** or **"Success"**
   - If you see errors, check the error message

---

## Step 5: Verify Tables Were Created

1. In the left sidebar, expand **"anihub"** database
2. Expand **"Schemas"**
3. Expand **"public"**
4. Expand **"Tables"**

You should see these tables:
- ✅ `users`
- ✅ `tracker`
- ✅ `discussions`
- ✅ `discussion_votes`

If you see all 4 tables, you're done! 🎉

---

## Step 6: Test Database Connection

1. Open PowerShell
2. Navigate to server folder:
   ```powershell
   cd server
   ```

3. Run the test script:
   ```powershell
   node test-db.js
   ```

You should see:
```
✅ Database connected successfully!
Current time: [some date/time]
PostgreSQL version: PostgreSQL 18.x
📊 Tables found:
  - users
  - tracker
  - discussions
  - discussion_votes
```

---

## Troubleshooting

### "Password authentication failed"
- Make sure you're using the correct password
- This is the password you set during PostgreSQL installation
- If you forgot it, you may need to reset it (see PostgreSQL documentation)

### "Database already exists"
- That's okay! The database is already created
- Skip Step 3 and go to Step 4

### "Relation already exists" (when running schema)
- Tables already exist - that's fine!
- Your database is already set up
- Skip to Step 5 to verify

### "Permission denied"
- Make sure you're connected as `postgres` user
- This user has full permissions

### Query Tool shows errors
- Check the error message - it will tell you what's wrong
- Common issues:
  - Syntax errors (shouldn't happen with our schema)
  - Tables already exist (not a problem)
  - Missing semicolons (our schema has them)

---

## What's Next?

Once the database is set up:

1. **Configure Backend**:
   ```powershell
   cd server
   Copy-Item env.example .env
   ```
   Then edit `.env` and update `DB_PASSWORD` with your PostgreSQL password

2. **Test Connection**:
   ```powershell
   node test-db.js
   ```

3. **Start Backend**:
   ```powershell
   npm run dev
   ```

4. **Start Frontend** (new terminal):
   ```powershell
   cd client
   npm run dev
   ```

5. **Test Registration**:
   - Open http://localhost:5173
   - Click "Register"
   - Create an account!

---

## Visual Guide

### pgAdmin Layout:
```
Left Sidebar:
├── Servers
│   └── PostgreSQL 18 (or your server name)
│       ├── Databases
│       │   └── anihub ← Your database
│       │       ├── Schemas
│       │       │   └── public
│       │       │       └── Tables ← Your tables here
│       └── Login/Group Roles
```

### Query Tool:
- Top: Toolbar with Execute button (▶️)
- Middle: SQL editor (paste your SQL here)
- Bottom: Results/Message area (shows success/errors)

---

## Need Help?

If you get stuck:
1. Check the error message in pgAdmin
2. Verify PostgreSQL service is running
3. Make sure you're using the correct password
4. Try the test script: `node test-db.js`

Good luck! 🚀
