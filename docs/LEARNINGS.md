# Learning Notes

This document tracks key concepts and learnings as we build AniHub.

---

## Architecture Concepts

### Frontend-Backend Separation

**Why separate?**
- Frontend can be deployed independently
- Backend can serve multiple clients (web, mobile app)
- Easier to scale each part separately
- Clear separation of concerns

**How they communicate:**
- Frontend makes HTTP requests (GET, POST, PUT, DELETE)
- Backend responds with JSON data
- REST API pattern (standard way to structure URLs)

---

## React Concepts

### Components
- **What**: Reusable pieces of UI
- **Why**: Avoid repeating code, easier to maintain
- **Example**: `<Navbar />` component used on every page

### State
- **What**: Data that can change
- **Why**: UI updates when state changes
- **Example**: `const [user, setUser] = useState(null)`

### Effects
- **What**: Code that runs when something changes
- **Why**: Load data when component mounts, handle side effects
- **Example**: Load anime list when Browse page opens

### Routing
- **What**: Show different pages based on URL
- **Why**: Users can bookmark pages, use browser back/forward
- **Example**: `/browse` shows Browse page, `/tracker` shows Tracker page

---

## Backend Concepts

### Routes
- **What**: Define URL endpoints
- **Why**: Organize API endpoints logically
- **Example**: `/api/anime/search` handles anime search

### Controllers
- **What**: Functions that handle request logic
- **Why**: Keep routes clean, separate concerns
- **Example**: `animeController.search()` handles search logic

### Middleware
- **What**: Code that runs before routes
- **Why**: Reusable logic (auth, error handling)
- **Example**: `authenticateToken` checks if user is logged in

### Database Queries
- **What**: SQL commands to get/save data
- **Why**: Store data permanently
- **Example**: `SELECT * FROM users WHERE email = ?`

---

## Authentication (JWT)

### What is JWT?
- JSON Web Token
- Like a temporary ID card
- Contains user info (userId, email)
- Signed with secret key

### How it works:
1. User logs in → Backend creates token
2. Frontend saves token → localStorage
3. Frontend sends token → With every request
4. Backend verifies token → Checks if valid
5. If valid → Request proceeds
6. If invalid → Return 401 Unauthorized

### Why JWT?
- Stateless (no need to store sessions on server)
- Secure (signed, can't be tampered)
- Portable (works across different servers)

---

## Database Concepts

### Tables
- **What**: Organized data storage
- **Why**: Efficient querying, relationships
- **Example**: `users` table stores user accounts

### Primary Key
- **What**: Unique identifier for each row
- **Why**: Reference rows from other tables
- **Example**: `id` column in `users` table

### Foreign Key
- **What**: Reference to another table
- **Why**: Create relationships between tables
- **Example**: `tracker.user_id` references `users.id`

### Relationships
- **1:N (One to Many)**: One user has many tracker entries
- **N:1 (Many to One)**: Many tracker entries belong to one user
- **N:N (Many to Many)**: Would need junction table

---

## API Design

### RESTful URLs
- **GET** `/api/anime` → Get list
- **GET** `/api/anime/:id` → Get one item
- **POST** `/api/anime` → Create item
- **PUT** `/api/anime/:id` → Update item
- **DELETE** `/api/anime/:id` → Delete item

### HTTP Status Codes
- **200 OK** → Success
- **201 Created** → Item created
- **400 Bad Request** → Invalid data
- **401 Unauthorized** → Not logged in
- **403 Forbidden** → No permission
- **404 Not Found** → Resource doesn't exist
- **500 Server Error** → Something went wrong

---

## Security Best Practices

### Password Hashing
- **Never** store plain passwords
- Use `bcryptjs` to hash passwords
- Compare hashes, not plain text

### SQL Injection Prevention
- Use parameterized queries
- Never concatenate user input into SQL
- Example: `query('SELECT * FROM users WHERE email = $1', [email])`

### CORS
- Configure allowed origins
- Don't use `*` in production
- Only allow your frontend URL

### Environment Variables
- Store secrets in `.env` file
- Never commit `.env` to Git
- Use different values for dev/production

---

## Common Patterns

### Error Handling
```javascript
try {
  // Do something
} catch (error) {
  // Handle error
  next(error) // Pass to error handler
}
```

### Async/Await
```javascript
async function getData() {
  const response = await fetch('/api/data')
  const data = await response.json()
  return data
}
```

### Conditional Rendering
```javascript
{isLoggedIn ? <Profile /> : <Login />}
```

---

## External APIs

### Jikan API
- Free anime database
- No authentication needed
- Rate limit: 3 requests/second
- Base URL: `https://api.jikan.moe/v4`

### MangaDex API
- Free manga database
- No authentication needed
- Rate limit: Varies
- Base URL: `https://api.mangadex.org`

### Best Practices
- Cache responses when possible
- Handle rate limits
- Show loading states
- Handle errors gracefully

---

## Development Workflow

### 1. Plan
- Understand requirement
- Design data structure
- Plan API endpoints

### 2. Build Backend
- Create route
- Create controller
- Write database query
- Test with Postman/curl

### 3. Build Frontend
- Create component/page
- Call API
- Handle response
- Update UI

### 4. Test
- Test happy path
- Test error cases
- Test edge cases

### 5. Refine
- Fix bugs
- Improve UI
- Add comments
- Document

---

## Debugging Tips

### Frontend
- Use browser DevTools
- Check Network tab for API calls
- Check Console for errors
- Use React DevTools

### Backend
- Add `console.log()` statements
- Check server logs
- Use Postman to test APIs
- Check database directly

### Database
- Use `psql` command line
- Use pgAdmin (GUI tool)
- Check table structure
- Verify data

---

## Next Steps

As we build features, we'll add more learnings here:
- Authentication implementation
- API integration patterns
- State management
- Form handling
- And more!
