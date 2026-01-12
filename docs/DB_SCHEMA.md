# Database Schema

## Overview

This document describes the PostgreSQL database schema for AniHub.

**Why PostgreSQL?**
- Relational database (data organized in tables)
- Free and open source
- Great for structured data
- Supports complex queries

---

## Tables

### 1. `users`

Stores user account information.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id` - Primary key (auto-incrementing)
- `email` - User's email (unique, required)
- `password_hash` - Hashed password (never store plain passwords!)
- `username` - Display name (unique, required)
- `created_at` - When account was created
- `updated_at` - When account was last updated

**Indexes:**
- `email` - For fast login lookups
- `username` - For fast username lookups

---

### 2. `tracker`

Stores user's anime/manga tracking data.

```sql
CREATE TABLE tracker (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  anime_id INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch')),
  progress INTEGER DEFAULT 0,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, anime_id)
);
```

**Columns:**
- `id` - Primary key
- `user_id` - Foreign key to `users.id`
- `anime_id` - Anime ID from Jikan API (not a foreign key, stored as integer)
- `status` - Current status (watching, completed, etc.)
- `progress` - Episodes/chapters watched/read
- `rating` - User's rating (1-10)
- `notes` - Personal notes
- `created_at` - When added to tracker
- `updated_at` - When last updated

**Constraints:**
- `UNIQUE(user_id, anime_id)` - User can only track each anime once
- `CHECK` constraints ensure valid status and rating values
- `ON DELETE CASCADE` - If user is deleted, their tracker entries are deleted too

**Indexes:**
- `user_id` - For fast queries of user's tracker
- `anime_id` - For queries by anime

---

### 3. `discussions`

Stores community discussion posts.

```sql
CREATE TABLE discussions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  anime_id INTEGER,
  agree_count INTEGER DEFAULT 0,
  disagree_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id` - Primary key
- `user_id` - Foreign key to `users.id` (who created the post)
- `title` - Discussion title
- `content` - Discussion content/text
- `anime_id` - Optional: which anime this discussion is about
- `agree_count` - Number of agree votes (denormalized for performance)
- `disagree_count` - Number of disagree votes (denormalized for performance)
- `created_at` - When post was created
- `updated_at` - When post was last updated

**Indexes:**
- `user_id` - For queries by user
- `anime_id` - For queries by anime
- `created_at` - For sorting by newest

**Why denormalized counts?**
- Faster queries (don't need to COUNT votes every time)
- We'll update counts when votes are added/removed

---

### 4. `discussion_votes`

Stores individual votes on discussions.

```sql
CREATE TABLE discussion_votes (
  id SERIAL PRIMARY KEY,
  discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('agree', 'disagree')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(discussion_id, user_id)
);
```

**Columns:**
- `id` - Primary key
- `discussion_id` - Foreign key to `discussions.id`
- `user_id` - Foreign key to `users.id` (who voted)
- `vote_type` - Either 'agree' or 'disagree'
- `created_at` - When vote was cast

**Constraints:**
- `UNIQUE(discussion_id, user_id)` - User can only vote once per discussion
- `CHECK` ensures vote_type is valid

**Indexes:**
- `discussion_id` - For counting votes per discussion
- `user_id` - For queries by user

---

## Relationships

```
users (1) ────< (many) tracker
users (1) ────< (many) discussions
users (1) ────< (many) discussion_votes
discussions (1) ────< (many) discussion_votes
```

**Explanation:**
- One user can have many tracker entries
- One user can create many discussions
- One user can vote on many discussions
- One discussion can have many votes

---

## Example Queries

### Get user's tracker list
```sql
SELECT * FROM tracker 
WHERE user_id = 1 
ORDER BY updated_at DESC;
```

### Get discussion with vote counts
```sql
SELECT 
  d.*,
  u.username,
  (SELECT COUNT(*) FROM discussion_votes WHERE discussion_id = d.id AND vote_type = 'agree') as agree_count,
  (SELECT COUNT(*) FROM discussion_votes WHERE discussion_id = d.id AND vote_type = 'disagree') as disagree_count
FROM discussions d
JOIN users u ON d.user_id = u.id
ORDER BY d.created_at DESC;
```

### Get user's vote on a discussion
```sql
SELECT vote_type FROM discussion_votes
WHERE discussion_id = 1 AND user_id = 1;
```

---

## Database Setup

### 1. Install PostgreSQL
- Download from https://www.postgresql.org/download/
- Or use managed service (Railway, Render, etc.)

### 2. Create Database
```sql
CREATE DATABASE anihub;
```

### 3. Run Schema
Execute all CREATE TABLE statements above.

### 4. Create Indexes (Optional, for performance)
```sql
CREATE INDEX idx_tracker_user_id ON tracker(user_id);
CREATE INDEX idx_tracker_anime_id ON tracker(anime_id);
CREATE INDEX idx_discussions_user_id ON discussions(user_id);
CREATE INDEX idx_discussions_anime_id ON discussions(anime_id);
CREATE INDEX idx_discussions_created_at ON discussions(created_at);
CREATE INDEX idx_discussion_votes_discussion_id ON discussion_votes(discussion_id);
CREATE INDEX idx_discussion_votes_user_id ON discussion_votes(user_id);
```

---

## Notes for Beginners

### What is a Primary Key?
- Unique identifier for each row
- Auto-increments (1, 2, 3, ...)
- Used to reference rows from other tables

### What is a Foreign Key?
- Reference to another table's primary key
- Creates relationship between tables
- Example: `tracker.user_id` references `users.id`

### What is ON DELETE CASCADE?
- If parent row is deleted, child rows are automatically deleted
- Example: If user is deleted, their tracker entries are deleted too

### Why Denormalize Vote Counts?
- Storing counts in `discussions` table avoids counting votes every time
- Trade-off: Must update counts when votes change
- Faster reads, slightly slower writes (usually worth it)

### Why Store anime_id as INTEGER?
- Jikan API uses integer IDs
- We don't store full anime data (fetched from API when needed)
- Saves database space

---

## Future Enhancements

Possible additions (not in MVP):
- `genres` table (for genre-based recommendations)
- `anime_cache` table (cache anime data from API)
- `user_preferences` table (user settings)
- `notifications` table (if we add notifications later)
