# AniHub Product & Study Guide

Welcome to **AniHub**! This document is designed to help you understand the entire project, how it works, and how it was built from scratch. It serves as a study guide for understanding a full-stack **PERN** application.

## 1. Tech Stack (PERN)
This project uses the **PERN** stack, which stands for:
-   **P**ostgreSQL: The relational database to store users, anime lists, and discussions.
-   **E**xpress: The backend web framework for Node.js to handle API requests.
-   **R**eact: The frontend library for building the user interface.
-   **N**ode.js: The JavaScript runtime environment for the server.

---

## 2. Project Architecture
The project is split into two distinct parts:
1.  **Client (`/client`)**: The frontend React application. It runs in the user's browser (Port 5173).
2.  **Server (`/server`)**: The backend API. It runs on a server (Port 5000) and connects to the database.

**Data Flow:**
User Interaction (Browser) ↔ React Client ↔ HTTP Requests (Fetch) ↔ Express Server ↔ SQL Queries ↔ PostgreSQL Database.

---

## 3. File Structure & Purpose

### Backend (`/server`)
This is where the business logic lives.
-   **`server.js`**: The entry point. It starts the Express app, connects to the DB, and sets up middleware (CORS, JSON parsing).
-   **`database/`**:
    -   `db.js`: Configures the connection to PostgreSQL using `pg` library.
    -   `schema.sql`: Defines the database tables (users, tracker, platforms).
    -   `queries/*.js`: Actual SQL code. We keep SQL separate from logic for cleanliness.
-   **`controllers/`**: The "brain" of the API.
    -   `authController.js`: Handles `register` (hashing passwords) and `login` (generating JWT tokens).
    -   `animeController.js`: Fetches anime data from external Jikan API or local DB.
-   **`routes/`**: Defines URL endpoints (e.g., `/api/auth/login`) and maps them to controllers.
-   **`middleware/`**: Code that runs *before* the controller.
    -   `auth.js`: Checks if a user sends a valid JWT token. Protects private routes.
-   **`.env`**: Stores secret config like DB passwords (never commit this to GitHub!).

### Frontend (`/client`)
This is what the user sees.
-   **`index.html`**: The single HTML page that loads the React app.
-   **`src/main.jsx`**: The entry point that mounts the React app to the DOM.
-   **`src/App.jsx`**: Sets up Routing (Pages).
-   **`src/services/api.js`**: The bridge to the backend. All `fetch` calls live here so components stay clean.
-   **`src/pages/`**:
    -   `Home.jsx`: Landing page.
    -   `Auth/*.jsx`: Login/Register forms.
    -   `WhereToWatch.jsx`: Feature to find streaming links.
    -   `Profile.jsx`: User dashboard.

---

## 4. How It Was Built (Step-by-Step)

If you were to build this again from scratch, here is the workflow:

### Phase 1: Setup & Database
1.  **Initialize Project**: Create `client` (Vite) and `server` (Node) folders.
2.  **Database Design**: Plan the schema.
    -   *Logic*: Users need to track Anime. So we need a `users` table and a `tracker` table linked by `user_id`.
3.  **Setup Server**:
    -   Install `express`, `pg`, `dotenv`.
    -   Create `server.js` to listen on port 5000.
    -   Connect to DB in `db.js`.

### Phase 2: Authentication (The Hard Part)
1.  **Backend Auth**:
    -   Create `users` table in SQL.
    -   Make `register` route: Hash password with `bcrypt` -> Save to DB.
    -   Make `login` route: Find user -> Compare password hash -> Sign JWT token.
    -   Make `authMiddleware`: Verify JWT on protected routes.
2.  **Frontend Auth**:
    -   Create Login form.
    -   On submit, call API.
    -   If success, save Token to `localStorage`.

### Phase 3: Core Features (Tracker)
1.  **External API**: We used **Jikan API** (public) to get Anime data so we don't have to build a massive anime database ourselves.
2.  **Tracking Logic**:
    -   User searches Anime (Jikan API).
    -   User clicks "Add to List".
    -   Client sends `{ animeId, status }` to Server.
    -   Server saves to `tracker` table in SQL.

### Phase 4: Advanced Features (Where to Watch)
1.  **Data Problem**: Jikan doesn't have good streaming links.
2.  **Solution**: We built our own `platforms` table.
3.  **Implementation**:
    -   Seed DB with platforms (Netflix, Crunchyroll).
    -   Link popular anime IDs to these platforms.
    -   `WhereToWatch` page queries our local DB for this specific info.

### Phase 5: Polish & Profile
1.  **Profile Page**:
    -   Need to show user stats.
    -   Backend endpoint `getProfile` counts rows in `tracker` table (e.g., `count where status='completed'`).
    -   Frontend displays this data.

---

## 5. Key Concepts to Study

-   **REST API**: Notice how we use `GET` for fetching, `POST` for creating, `PUT` for updating.
-   **JWT (JSON Web Tokens)**: This is how the server knows who you are without using sessions.
-   **Component State (React)**: How `useState` and `useEffect` control what shows on the screen.
-   **SQL Joins**: Used in `queries/` to combine data (e.g., getting all discussions *plus* the username of the author).

## 6. Workflow for New Features
Want to add a "Favorites" feature? Follow this flow:
1.  **DB**: Add `is_favorite` column to tracker table OR create `favorites` table.
2.  **Backend**: Add `addToFavorites` query and controller function.
3.  **Route**: Add `POST /api/favorites`.
4.  **Frontend**: Add "Heart" button that calls the API.
