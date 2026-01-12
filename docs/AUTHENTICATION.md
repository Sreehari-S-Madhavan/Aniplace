# Authentication Implementation Guide

## What Was Built

We've implemented a complete authentication system for AniHub:

### Backend (Server)
1. **User Registration** (`POST /api/auth/register`)
   - Validates email, password, username
   - Checks for duplicate email/username
   - Hashes password with bcrypt
   - Creates user in database
   - Returns JWT token

2. **User Login** (`POST /api/auth/login`)
   - Validates credentials
   - Verifies password
   - Returns JWT token

3. **JWT Authentication Middleware**
   - Verifies tokens on protected routes
   - Extracts user info from token

### Frontend (Client)
1. **Login Page** (`/login`)
   - Email and password form
   - Error handling
   - Redirects to home after login

2. **Register Page** (`/register`)
   - Username, email, password form
   - Client-side validation
   - Redirects to home after registration

3. **Protected Routes**
   - Tracker and Profile pages require login
   - Redirects to login if not authenticated

4. **Navbar Updates**
   - Shows user info when logged in
   - Logout button
   - Dynamic login/register buttons

---

## How It Works

### Registration Flow

```
User fills form → Frontend validates → API call → Backend validates
→ Check duplicates → Hash password → Save to DB → Create JWT
→ Return token → Frontend saves token → Redirect to home
```

### Login Flow

```
User fills form → API call → Backend finds user → Verify password
→ Create JWT → Return token → Frontend saves token → Redirect to home
```

### Protected Route Flow

```
User visits /tracker → Check localStorage for token → If no token
→ Redirect to /login → If token exists → Show page
```

---

## Testing the Authentication

### Prerequisites
1. Database is set up and running
2. Backend server is running (`npm run dev` in `server/`)
3. Frontend is running (`npm run dev` in `client/`)

### Step 1: Set Up Database

1. Create PostgreSQL database:
   ```sql
   CREATE DATABASE anihub;
   ```

2. Run the schema:
   ```bash
   psql -U postgres -d anihub -f server/database/schema.sql
   ```
   Or copy-paste the SQL from `server/database/schema.sql` into your PostgreSQL client.

### Step 2: Configure Backend

1. Copy environment file:
   ```bash
   cd server
   cp env.example .env
   ```

2. Edit `.env`:
   - Update `DB_PASSWORD` with your PostgreSQL password
   - JWT_SECRET is already generated (or generate a new one)

### Step 3: Test Registration

1. Open browser: http://localhost:5173
2. Click "Register" in navbar
3. Fill in form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Register"
5. Should redirect to home page
6. Navbar should show "Hello, testuser"

### Step 4: Test Login

1. Click "Logout" in navbar
2. Click "Login"
3. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Login"
5. Should redirect to home page
6. Navbar should show user info

### Step 5: Test Protected Routes

1. While logged out, try to visit: http://localhost:5173/tracker
2. Should redirect to `/login`
3. Login again
4. Visit `/tracker` - should work now

### Step 6: Test Logout

1. Click "Logout" button
2. Should redirect to home
3. Navbar should show "Login" and "Register" buttons again

---

## API Endpoints

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "testuser"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "testuser",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error (400/409):**
```json
{
  "error": true,
  "message": "Email already registered"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "testuser",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error (401):**
```json
{
  "error": true,
  "message": "Invalid email or password"
}
```

---

## Security Features

### Password Hashing
- Passwords are hashed using `bcryptjs`
- Never stored in plain text
- Uses 10 salt rounds (configurable)

### JWT Tokens
- Tokens expire after 7 days
- Signed with secret key
- Contains userId and email (no sensitive data)

### Validation
- Email format validation
- Password length (minimum 6 characters)
- Username length (3-20 characters)
- Duplicate email/username checks

### Protected Routes
- Middleware verifies token on every request
- Returns 401 if token is invalid/missing
- Frontend redirects to login if not authenticated

---

## Common Issues

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify `.env` has correct database credentials
- Test connection: `psql -U postgres -d anihub`

### "Email already registered"
- User already exists
- Try different email or login instead

### "Invalid email or password"
- Check credentials are correct
- Verify user exists in database
- Check password wasn't changed

### CORS Error
- Make sure `FRONTEND_URL` in `.env` matches frontend URL
- Usually `http://localhost:5173` for Vite

### Token not working
- Check token is saved in localStorage
- Verify JWT_SECRET matches in `.env`
- Token might be expired (7 days)

---

## Next Steps

Now that authentication is working, you can:

1. **Build Tracker Feature**
   - Add anime to tracker
   - Update progress
   - View tracked items

2. **Build Browse Feature**
   - Search anime
   - View anime details
   - Integrate with Jikan API

3. **Build Discussions**
   - Create posts
   - Vote on discussions

4. **Improve Profile Page**
   - Show user stats
   - Edit profile settings

---

## Code Structure

### Backend Files
- `server/controllers/authController.js` - Registration/login logic
- `server/routes/auth.js` - Auth routes
- `server/middleware/auth.js` - JWT verification
- `server/database/queries/userQueries.js` - User database queries
- `server/utils/jwt.js` - JWT helper functions

### Frontend Files
- `client/src/pages/Login.jsx` - Login page
- `client/src/pages/Register.jsx` - Register page
- `client/src/components/ProtectedRoute.jsx` - Route protection
- `client/src/services/api.js` - API functions
- `client/src/services/auth.js` - Auth helpers

---

## Learning Points

1. **Password Security**: Never store plain passwords, always hash
2. **JWT Tokens**: Stateless authentication, no server-side sessions
3. **Protected Routes**: Check authentication before showing content
4. **Error Handling**: Show user-friendly error messages
5. **Validation**: Validate on both client and server side
