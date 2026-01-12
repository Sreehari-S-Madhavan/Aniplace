# AniHub - Anime & Manga Discovery Platform

A learning-first MVP web application for anime, manga, and light novel fans.

## 🎯 Project Goals

AniHub helps anime fans:
- **Discover** new anime and manga
- **Track** what they're watching/reading
- **Find** legal platforms to watch anime
- **Discuss** and debate with the community

## 🏗️ Project Structure

```
anihub/
├── client/          # React frontend (what users see)
├── server/          # Express backend (the brain)
├── docs/            # Documentation
│   ├── ARCHITECTURE.md    # System architecture explained
│   ├── PRODUCT.md         # Product requirements (coming soon)
│   ├── API.md             # API documentation (coming soon)
│   ├── DB_SCHEMA.md       # Database schema (coming soon)
│   └── LEARNINGS.md       # Learning notes (coming soon)
└── README.md        # This file
```

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **JavaScript** - Programming language
- **CSS** - Styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **REST API** - API architecture
- **JWT** - Authentication

### Database
- **PostgreSQL** - Relational database

### External APIs
- **Jikan API** - Anime data
- **MangaDex API** - Manga data

## 📚 Learning Resources

Start by reading:
1. **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Understand how everything works together

## 🚀 Getting Started

### Quick Start

1. **Read the Documentation**
   - Start with [ARCHITECTURE.md](./docs/ARCHITECTURE.md) to understand the system
   - Check [SETUP.md](./docs/SETUP.md) for installation instructions
   - Review [DB_SCHEMA.md](./docs/DB_SCHEMA.md) for database structure

2. **Set Up Backend**
   ```bash
   cd server
   npm install
   cp env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

3. **Set Up Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Set Up Database**
   - Create PostgreSQL database
   - Run SQL schema from [DB_SCHEMA.md](./docs/DB_SCHEMA.md)

See [SETUP.md](./docs/SETUP.md) for detailed instructions.

## 📝 Features (MVP)

- ✅ User authentication (register/login)
- ✅ Anime browse & search
- ✅ Anime detail page
- ✅ Personal tracker (watching/completed/on-hold)
- ✅ Genre-based recommendations (rule-based)
- ✅ Community posts with agree/disagree votes
- ✅ Legal platform links

## 🎓 Learning Approach

This project is designed for beginners. We:
- Build incrementally (one feature at a time)
- Explain WHY, not just WHAT
- Keep code simple and readable
- Use clear comments
- Avoid advanced patterns

## 📖 Navigation Structure

1. **Home** - Landing page
2. **Browse** - Discover anime/manga
3. **Tracker** - Personal tracking (logged-in only)
4. **Discussions** - Community posts
5. **Where to Watch** - Legal platforms
6. **Profile** - User settings (logged-in only)

## ⚠️ Constraints

- ❌ No piracy
- ❌ No streaming
- ❌ No AI features
- ❌ No chat
- ❌ No notifications
- ❌ No follower system

## 🤝 Contributing

This is a learning project. Focus on understanding, not perfection!

---

**Status**: Architecture phase complete. Ready to start building! 🚀
