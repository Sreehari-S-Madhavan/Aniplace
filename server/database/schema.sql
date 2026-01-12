-- AniHub Database Schema
-- Run this SQL file to create all tables

-- Enable UUID extension (if needed in future)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================
-- TRACKER TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tracker (
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

-- Indexes for tracker table
CREATE INDEX IF NOT EXISTS idx_tracker_user_id ON tracker(user_id);
CREATE INDEX IF NOT EXISTS idx_tracker_anime_id ON tracker(anime_id);
CREATE INDEX IF NOT EXISTS idx_tracker_status ON tracker(status);

-- ============================================
-- DISCUSSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS discussions (
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

-- Indexes for discussions table
CREATE INDEX IF NOT EXISTS idx_discussions_user_id ON discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_anime_id ON discussions(anime_id);
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions(created_at DESC);

-- ============================================
-- DISCUSSION_VOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS discussion_votes (
  id SERIAL PRIMARY KEY,
  discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('agree', 'disagree')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(discussion_id, user_id)
);

-- Indexes for discussion_votes table
CREATE INDEX IF NOT EXISTS idx_discussion_votes_discussion_id ON discussion_votes(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_votes_user_id ON discussion_votes(user_id);

-- ============================================
-- DISCUSSION_COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS discussion_comments (
  id SERIAL PRIMARY KEY,
  discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for discussion_comments table
CREATE INDEX IF NOT EXISTS idx_discussion_comments_discussion_id ON discussion_comments(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_comments_user_id ON discussion_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_comments_created_at ON discussion_comments(created_at DESC);

-- ============================================
-- PLATFORMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS platforms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  website_url VARCHAR(255),
  logo_url VARCHAR(255),
  region VARCHAR(10) DEFAULT 'US', -- ISO country code
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for platforms table
CREATE INDEX IF NOT EXISTS idx_platforms_name ON platforms(name);
CREATE INDEX IF NOT EXISTS idx_platforms_region ON platforms(region);
CREATE INDEX IF NOT EXISTS idx_platforms_active ON platforms(is_active);

-- ============================================
-- ANIME_PLATFORMS TABLE (junction table)
-- ============================================
CREATE TABLE IF NOT EXISTS anime_platforms (
  id SERIAL PRIMARY KEY,
  anime_id INTEGER NOT NULL,
  platform_id INTEGER NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'upcoming', 'expired')),
  url VARCHAR(500), -- Direct link to anime on platform
  region VARCHAR(10) DEFAULT 'US',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(anime_id, platform_id, region)
);

-- Indexes for anime_platforms table
CREATE INDEX IF NOT EXISTS idx_anime_platforms_anime_id ON anime_platforms(anime_id);
CREATE INDEX IF NOT EXISTS idx_anime_platforms_platform_id ON anime_platforms(platform_id);
CREATE INDEX IF NOT EXISTS idx_anime_platforms_region ON anime_platforms(region);

-- ============================================
-- TRIGGER: Update updated_at timestamp
-- ============================================
-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracker_updated_at BEFORE UPDATE ON tracker
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussion_comments_updated_at BEFORE UPDATE ON discussion_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platforms_updated_at BEFORE UPDATE ON platforms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_anime_platforms_updated_at BEFORE UPDATE ON anime_platforms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment to insert test data
/*
INSERT INTO users (email, password_hash, username) VALUES
('test@example.com', '$2a$10$example_hash_here', 'testuser');

-- Sample platforms
INSERT INTO platforms (name, display_name, website_url, region) VALUES
('crunchyroll', 'Crunchyroll', 'https://crunchyroll.com', 'US'),
('funimation', 'Funimation', 'https://funimation.com', 'US'),
('netflix', 'Netflix', 'https://netflix.com', 'US'),
('hulu', 'Hulu', 'https://hulu.com', 'US'),
('amazon_prime', 'Amazon Prime Video', 'https://primevideo.com', 'US'),
('hidive', 'HIDIVE', 'https://hidive.com', 'US'),
('tubi', 'Tubi', 'https://tubi.tv', 'US');

-- Note: password_hash above is just a placeholder
-- Real passwords will be hashed using bcryptjs
*/
