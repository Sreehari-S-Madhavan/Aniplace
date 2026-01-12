# AniHub System Architecture

## 🎯 Overview: What Are We Building?

AniHub is a web application that lets anime fans:
- Browse and search for anime and manga
- Track what they're watching/reading
- Discover new content by genre
- See where to legally watch anime
- Discuss and debate with other fans

Think of it like a combination of:
- **IMDb** (for browsing and details)
- **Goodreads** (for tracking progress)
- **Reddit** (for discussions)

---

## 🏗️ The Big Picture: Three Main Parts

Every web application has three main parts that work together:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Frontend   │ ◄─────► │   Backend   │ ◄─────► │  Database   │
│  (React)    │  HTTP   │  (Express)  │  SQL    │ (PostgreSQL)│
│  Browser    │         │   Server    │         │   Storage   │
└─────────────┘         └─────────────┘         └─────────────┘
```

### 1. **Frontend (Client)** - What Users See
- **What it is**: The part that runs in the user's web browser
- **Technology**: React + Vite
- **Job**: Shows pages, handles clicks, sends requests to backend
- **Location**: Lives in the `client/` folder

### 2. **Backend (Server)** - The Brain
- **What it is**: The part that runs on a server (computer in the cloud)
- **Technology**: Node.js + Express.js
- **Job**: Processes requests, talks to database, handles business logic
- **Location**: Lives in the `server/` folder

### 3. **Database** - The Memory
- **What it is**: Where all data is stored permanently
- **Technology**: PostgreSQL
- **Job**: Stores users, anime info, discussions, tracking data
- **Location**: Lives on a managed service (like Railway or Render)

---

## 🔄 How They Talk to Each Other

### The Request-Response Cycle

When a user clicks "Login" button:

```
1. User clicks "Login" button
   ↓
2. Frontend sends HTTP request to Backend
   POST /api/auth/login
   Body: { email: "user@example.com", password: "secret123" }
   ↓
3. Backend receives request
   - Validates the data
   - Checks database for user
   - Creates a JWT token (like a temporary ID card)
   ↓
4. Backend sends response back
   Status: 200 OK
   Body: { token: "abc123xyz...", user: { id: 1, name: "John" } }
   ↓
5. Frontend receives response
   - Saves token in browser storage
   - Redirects to home page
   - Shows user's name in header
```

---

## 📱 Frontend Architecture (React + Vite)

### What is React?
React is a JavaScript library that lets us build user interfaces using **components** - reusable pieces of UI.

### Component Structure

```
client/
├── src/
│   ├── components/          # Reusable UI pieces
│   │   ├── Button.jsx       # A button component
│   │   ├── Card.jsx         # A card component
│   │   └── Navbar.jsx       # Navigation bar
│   │
│   ├── pages/               # Full page components
│   │   ├── Home.jsx         # Home page
│   │   ├── Browse.jsx       # Browse anime page
│   │   ├── Tracker.jsx      # User's tracker page
│   │   ├── Discussions.jsx  # Discussions page
│   │   ├── WhereToWatch.jsx # Legal platforms page
│   │   └── Profile.jsx      # User profile page
│   │
│   ├── services/            # Functions that talk to backend
│   │   ├── api.js           # HTTP request functions
│   │   └── auth.js          # Authentication helpers
│   │
│   ├── App.jsx              # Main app component (routes)
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
│
├── package.json             # Dependencies list
└── vite.config.js           # Vite configuration
```

### How Frontend Works

1. **Components**: Small, reusable pieces of UI
   - Example: `<Button>Login</Button>` creates a button

2. **State**: Data that can change (like user info, search results)
   - Example: `const [user, setUser] = useState(null)`

3. **Effects**: Code that runs when something changes
   - Example: Load anime list when page loads

4. **Routing**: Showing different pages based on URL
   - `/` → Home page
   - `/browse` → Browse page
   - `/tracker` → Tracker page (only if logged in)

5. **API Calls**: Sending requests to backend
   - Example: `fetch('/api/anime/search?q=naruto')`

---

## 🖥️ Backend Architecture (Node.js + Express)

### What is Express?
Express is a framework that makes it easy to create a web server that handles HTTP requests.

### Server Structure

```
server/
├── routes/                  # URL endpoints
│   ├── auth.js             # /api/auth/login, /api/auth/register
│   ├── anime.js            # /api/anime/search, /api/anime/:id
│   ├── tracker.js          # /api/tracker/add, /api/tracker/list
│   ├── discussions.js      # /api/discussions/create, /api/discussions/:id/vote
│   └── platforms.js        # /api/platforms/:animeId
│
├── controllers/            # Business logic (what to do)
│   ├── authController.js   # Handle login/register logic
│   ├── animeController.js # Handle anime search/details
│   ├── trackerController.js # Handle tracker operations
│   └── discussionController.js # Handle discussion logic
│
├── middleware/             # Code that runs before routes
│   ├── auth.js             # Check if user is logged in (JWT)
│   └── errorHandler.js     # Handle errors gracefully
│
├── database/               # Database connection & queries
│   ├── db.js               # Connect to PostgreSQL
│   └── queries/            # SQL queries
│       ├── userQueries.js  # User-related queries
│       ├── trackerQueries.js # Tracker queries
│       └── discussionQueries.js # Discussion queries
│
├── utils/                  # Helper functions
│   └── jwt.js              # Create/verify JWT tokens
│
├── server.js               # Main entry point
└── package.json            # Dependencies
```

### How Backend Works

1. **Routes**: Define URL endpoints
   ```javascript
   // Example: GET /api/anime/search?q=naruto
   app.get('/api/anime/search', animeController.search)
   ```

2. **Controllers**: Handle the actual logic
   - Receive request data
   - Query database
   - Call external APIs (Jikan, MangaDex)
   - Send response back

3. **Middleware**: Code that runs before routes
   - **Auth middleware**: Checks if user is logged in
   - **Error handler**: Catches errors and sends nice error messages

4. **Database Queries**: SQL commands to get/save data
   ```sql
   SELECT * FROM users WHERE email = 'user@example.com'
   ```

---

## 🗄️ Database Architecture (PostgreSQL)

### What is PostgreSQL?
PostgreSQL is a relational database - it stores data in tables with relationships between them.

### Database Schema (Tables)

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password_hash   │
│ username        │
│ created_at      │
└─────────────────┘
        │
        │ 1:N (one user has many tracker entries)
        │
        ▼
┌─────────────────┐
│   tracker       │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)     │──┐
│ anime_id        │  │
│ status          │  │
│ progress        │  │
│ rating          │  │
│ created_at      │  │
└─────────────────┘  │
                     │
                     │ N:1 (many tracker entries reference one user)
                     │
┌─────────────────┐  │
│  discussions    │  │
├─────────────────┤  │
│ id (PK)         │  │
│ user_id (FK)     │──┘
│ title           │
│ content         │
│ anime_id        │
│ created_at      │
└─────────────────┘
        │
        │ 1:N (one discussion has many votes)
        │
        ▼
┌─────────────────┐
│ discussion_votes│
├─────────────────┤
│ id (PK)         │
│ discussion_id   │
│ user_id         │
│ vote_type       │ (agree/disagree)
│ created_at      │
└─────────────────┘
```

### Key Concepts

1. **Primary Key (PK)**: Unique identifier for each row
   - Example: `id` column

2. **Foreign Key (FK)**: Reference to another table
   - Example: `user_id` in `tracker` table references `users.id`

3. **Relationships**:
   - **1:N (One to Many)**: One user has many tracker entries
   - **N:1 (Many to One)**: Many tracker entries belong to one user

---

## 🔐 Authentication Flow (JWT)

### What is JWT?
JWT (JSON Web Token) is like a temporary ID card. When a user logs in, the server gives them a token. They must show this token with every request to prove they're logged in.

### Authentication Steps

```
1. User registers/logs in
   ↓
2. Backend validates credentials
   ↓
3. Backend creates JWT token
   Token contains: { userId: 1, email: "user@example.com" }
   ↓
4. Backend sends token to frontend
   ↓
5. Frontend saves token (localStorage or sessionStorage)
   ↓
6. Frontend includes token in every request
   Header: Authorization: Bearer abc123xyz...
   ↓
7. Backend middleware checks token
   - Is it valid?
   - Is it expired?
   - Extract user info
   ↓
8. If valid, request proceeds
   If invalid, return 401 Unauthorized
```

---

## 🌐 External APIs Integration

### Jikan API (Anime Data)
- **What**: Free anime database API
- **Usage**: Get anime list, search, details
- **Example**: `GET https://api.jikan.moe/v4/anime?q=naruto`

### MangaDex API (Manga Data)
- **What**: Free manga database API
- **Usage**: Get manga list, search, details
- **Example**: `GET https://api.mangadex.org/manga?title=naruto`

### How It Works
1. User searches for anime on frontend
2. Frontend sends request to our backend: `GET /api/anime/search?q=naruto`
3. Backend receives request
4. Backend calls Jikan API: `GET https://api.jikan.moe/v4/anime?q=naruto`
5. Backend processes Jikan response
6. Backend sends formatted data to frontend
7. Frontend displays results

**Why not call Jikan directly from frontend?**
- Security: Hide API keys if needed
- Control: We can cache, filter, or modify data
- Consistency: Same format for all data

---

## 📊 Data Flow Examples

### Example 1: User Searches for Anime

```
User types "Naruto" in search box
    ↓
Frontend: User types in input field
    ↓
Frontend: User clicks "Search" button
    ↓
Frontend: Calls fetch('/api/anime/search?q=naruto')
    ↓
Backend: Receives GET /api/anime/search?q=naruto
    ↓
Backend: Calls Jikan API
    ↓
Jikan API: Returns anime list
    ↓
Backend: Formats data and sends to frontend
    ↓
Frontend: Receives data, updates state
    ↓
Frontend: Displays anime cards on screen
```

### Example 2: User Adds Anime to Tracker

```
User clicks "Add to Tracker" button
    ↓
Frontend: Shows form (status: watching/completed/etc)
    ↓
Frontend: User selects "Watching" and clicks "Save"
    ↓
Frontend: Calls POST /api/tracker/add
    Body: { animeId: 123, status: "watching", progress: 0 }
    Header: Authorization: Bearer abc123xyz...
    ↓
Backend: Auth middleware checks token → Valid!
    ↓
Backend: Extracts userId from token
    ↓
Backend: Controller receives request
    ↓
Backend: Runs SQL query
    INSERT INTO tracker (user_id, anime_id, status, progress)
    VALUES (1, 123, 'watching', 0)
    ↓
Database: Saves new row
    ↓
Backend: Sends success response
    ↓
Frontend: Shows "Added to tracker!" message
    ↓
Frontend: Refreshes tracker list
```

---

## 🎨 UI/UX Features

### React Components for Great UI
- **Smooth hover effects**: Buttons and cards that respond to mouse
- **Gentle tilt effects**: Cards that slightly tilt on hover
- **Scroll-based animations**: Elements that animate as you scroll
- **Animated glitch style**: Cool text effects (sparingly)
- **Inertia-based scroll**: Smooth, natural scrolling

### Where These Come From
- React Bits (component library)
- Acerternity UI (component library)
- Custom CSS animations

**Important**: We'll only use what we need, not everything!

---

## 🚀 Deployment (Future)

### Frontend → Vercel/Netlify
- Build React app: `npm run build`
- Upload `dist/` folder
- Done! Frontend is live

### Backend → Railway/Render
- Connect GitHub repository
- Set environment variables (database URL, JWT secret)
- Deploy! Backend is live

### Database → Managed PostgreSQL
- Create database on Railway/Render
- Get connection string
- Use in backend

---

## 📝 Key Learning Points

### For Beginners to Understand:

1. **Separation of Concerns**
   - Frontend = Presentation (what users see)
   - Backend = Logic (how things work)
   - Database = Storage (where data lives)

2. **HTTP Requests**
   - GET = Read data
   - POST = Create data
   - PUT = Update data
   - DELETE = Remove data

3. **State Management**
   - Frontend state = Temporary data (like search results)
   - Database = Permanent data (like user accounts)

4. **Authentication**
   - JWT tokens = Temporary proof of identity
   - Must be checked on every protected route

5. **API Design**
   - RESTful = Standard way to structure URLs
   - `/api/resource` = Collection
   - `/api/resource/:id` = Single item

---

## 🎯 Next Steps

After understanding this architecture, we'll build:

1. **Project Setup**
   - Initialize frontend (React + Vite)
   - Initialize backend (Node + Express)
   - Set up database schema

2. **Authentication**
   - User registration
   - User login
   - JWT token handling

3. **Core Features** (one at a time)
   - Browse anime
   - Search anime
   - Anime details
   - Tracker
   - Discussions
   - Where to Watch

Each feature will be built incrementally with explanations!

---

## ❓ Common Questions

**Q: Why not use TypeScript?**
A: We're keeping it simple for beginners. JavaScript is easier to learn first.

**Q: Why no ORM?**
A: Learning SQL directly helps understand databases better. We'll use simple query functions.

**Q: Why separate frontend and backend?**
A: This is the standard way. Frontend can be deployed separately, and backend can serve multiple clients (web, mobile app, etc.).

**Q: What if the external API is down?**
A: We'll handle errors gracefully and show a message to users. We can also cache data in our database.

---

## 📚 Summary

- **Frontend (React)**: What users see and interact with
- **Backend (Express)**: Processes requests and handles logic
- **Database (PostgreSQL)**: Stores all data permanently
- **External APIs**: Get anime/manga data
- **JWT**: Secure authentication system

All parts work together to create a complete web application!
