# Windows Setup Guide for AniHub

## PostgreSQL Installation & Setup

### Option 1: Install PostgreSQL Locally (Recommended for Development)

#### Step 1: Download PostgreSQL
1. Go to: https://www.postgresql.org/download/windows/
2. Download the PostgreSQL installer
3. Run the installer

#### Step 2: Installation Options
- **Installation Directory**: Default is fine (usually `C:\Program Files\PostgreSQL\16`)
- **Data Directory**: Default is fine
- **Password**: Set a password for the `postgres` user (remember this!)
- **Port**: Default 5432 is fine
- **Locale**: Default is fine

#### Step 3: Add PostgreSQL to PATH (Optional but Recommended)
1. Open System Properties → Environment Variables
2. Edit "Path" in System Variables
3. Add: `C:\Program Files\PostgreSQL\16\bin` (adjust version number)
4. Click OK

#### Step 4: Verify Installation
Open PowerShell and run:
```powershell
psql --version
```

If you see a version number, PostgreSQL is installed correctly!

---

### Option 2: Use pgAdmin (GUI Tool - Easier!)

pgAdmin comes with PostgreSQL installer, or download separately.

#### Using pgAdmin:

1. **Open pgAdmin** (search in Start menu)

2. **Connect to Server**:
   - Right-click "Servers" → "Create" → "Server"
   - General tab:
     - Name: `AniHub Local`
   - Connection tab:
     - Host: `localhost`
     - Port: `5432`
     - Username: `postgres`
     - Password: (the password you set during installation)
   - Click "Save"

3. **Create Database**:
   - Right-click "Databases" → "Create" → "Database"
   - Name: `anihub`
   - Click "Save"

4. **Run Schema SQL**:
   - Right-click `anihub` database → "Query Tool"
   - Open `server/database/schema.sql` in a text editor
   - Copy all the SQL
   - Paste into Query Tool
   - Click "Execute" (or press F5)

---

### Option 3: Use Managed PostgreSQL Service (Easiest for Beginners!)

If you don't want to install PostgreSQL locally, use a free cloud service:

#### Railway (Recommended)
1. Go to: https://railway.app/
2. Sign up (free tier available)
3. Click "New Project"
4. Click "Provision PostgreSQL"
5. Copy the connection string
6. Update your `.env` file with the connection details

#### Render
1. Go to: https://render.com/
2. Sign up
3. Create new PostgreSQL database
4. Copy connection string
5. Update `.env` file

**Connection String Format:**
```
postgresql://user:password@host:port/database
```

Update `server/.env`:
```
DB_HOST=your-host-from-railway
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=your-password-from-railway
```

---

## Setting Up Database (After PostgreSQL is Ready)

### Method 1: Using pgAdmin (Easiest)

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → Create → Database
4. Name: `anihub`
5. Right-click `anihub` → Query Tool
6. Open `server/database/schema.sql` in a text editor
7. Copy all SQL and paste into Query Tool
8. Click Execute (F5)

### Method 2: Using PowerShell (If psql is in PATH)

```powershell
# Connect to PostgreSQL
psql -U postgres

# In psql prompt, run:
CREATE DATABASE anihub;
\q

# Run schema
psql -U postgres -d anihub -f server/database/schema.sql
```

### Method 3: Using Command Prompt (If psql is in PATH)

```cmd
cd "C:\Program Files\PostgreSQL\16\bin"
psql.exe -U postgres
```

Then in psql:
```sql
CREATE DATABASE anihub;
\q
```

Then:
```cmd
psql.exe -U postgres -d anihub -f "C:\Users\Sreehari S Madhavan\Documents\Aniplace\server\database\schema.sql"
```

---

## Troubleshooting

### "psql is not recognized"
**Solution**: PostgreSQL is not in PATH or not installed.

**Option A**: Add to PATH
1. Find PostgreSQL installation (usually `C:\Program Files\PostgreSQL\16\bin`)
2. Add to System PATH (see instructions above)

**Option B**: Use full path
```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
```

**Option C**: Use pgAdmin instead (no PATH needed)

### "Password authentication failed"
- Check password is correct
- Default user is `postgres`
- Password was set during installation

### "Database does not exist"
- Make sure you created the database first
- Check database name matches in `.env`

### "Connection refused"
- Check PostgreSQL service is running:
  ```powershell
  Get-Service -Name "*postgres*"
  ```
- Start service if stopped:
  ```powershell
  Start-Service postgresql-x64-16  # Adjust version number
  ```

---

## Quick Start Checklist

- [ ] PostgreSQL installed OR using cloud service
- [ ] Database `anihub` created
- [ ] Schema SQL executed successfully
- [ ] `.env` file created in `server/` folder
- [ ] Database credentials in `.env` are correct
- [ ] Backend server starts without errors
- [ ] Can connect to database

---

## Testing Database Connection

Create a test file `server/test-db.js`:

```javascript
require('dotenv').config()
const { pool } = require('./database/db')

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('✅ Database connected!')
    console.log('Current time:', result.rows[0].now)
    process.exit(0)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

testConnection()
```

Run it:
```powershell
cd server
node test-db.js
```

If you see "✅ Database connected!", you're good to go!

---

## Next Steps

Once database is set up:
1. Update `server/.env` with correct database credentials
2. Start backend: `cd server && npm run dev`
3. Start frontend: `cd client && npm run dev`
4. Test registration/login

See `docs/AUTHENTICATION.md` for testing instructions.
