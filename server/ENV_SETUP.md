# Environment File Setup

## Important: Update Your .env File!

The `.env` file has been created, but you **MUST** update the database password.

### Step 1: Open .env File

Open `server/.env` in your text editor (VS Code, Notepad, etc.)

### Step 2: Update Database Password

Find this line:
```
DB_PASSWORD=your-database-password
```

Replace `your-database-password` with your actual PostgreSQL password (the one you set during PostgreSQL installation or use in pgAdmin).

Example:
```
DB_PASSWORD=mypassword123
```

### Step 3: Verify Other Settings

Make sure these are correct:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=anihub
DB_USER=postgres
```

### Step 4: Test Connection

After updating the password, test the connection:
```powershell
cd server
node test-db.js
```

You should see:
```
✅ Database connected successfully!
```

---

## Don't Have Your Password?

If you forgot your PostgreSQL password:

1. **Check pgAdmin**: The password you use to connect in pgAdmin is your PostgreSQL password
2. **Reset password**: You may need to reset it (see PostgreSQL documentation)
3. **Default**: If you didn't set one, try common defaults like `postgres` or `admin`

---

## Security Note

Never commit the `.env` file to Git! It contains sensitive information.
The `.gitignore` file already excludes it.
