# Deployment Guide for AniHub (PERN Stack)

This guide explains how to deploy your **P**ostgreSQL, **E**xpress, **R**eact, **N**ode application to **Render**, which is a cloud platform that supports all these components easily.

## Prerequisites
1.  **GitHub Account**: You must have your code pushed to a GitHub repository.
2.  **Render Account**: Sign up at [render.com](https://render.com/).

## Step 1: Prepare Your Code
Before deploying, ensure your `server/package.json` and `client/package.json` are ready.

### Server
Ensure your `server/package.json` has a `start` script:
```json
"scripts": {
  "start": "node server.js"
}
```

### Client
Ensure `client/vite.config.js` is set to build correctly. (We already updated it).

---

## Step 2: Deploy Database (PostgreSQL)
1.  Go to Render Dashboard and click **New +** -> **PostgreSQL**.
2.  **Name**: `anihub-db`
3.  **Region**: Choose closest to you (e.g., Singapore, Frankfurt, US East).
4.  **Instance Type**: Free (for hobby projects).
5.  Click **Create Database**.
6.  **Copy the "Internal Connection String"**. You will need this for the backend.

---

## Step 3: Deploy Backend (Node/Express)
1.  Click **New +** -> **Web Service**.
2.  Connect your GitHub repository.
3.  **Root Directory**: `server` (Important! This tells Render the backend code is in the server folder).
4.  **Runtime**: Node
5.  **Build Command**: `npm install`
6.  **Start Command**: `npm start`
7.  **Environment Variables**:
    -   `PORT`: `10000` (Render default)
    -   `NODE_ENV`: `production`
    -   `DB_HOST`: (Use Host from DB connection details)
    -   `DB_USER`: (Use User from DB details)
    -   `DB_PASSWORD`: (Use details)
    -   `DB_NAME`: (Use details)
    -   `JWT_SECRET`: (Generate a secure random string)
    -   **OR simpler**: Just set `DATABASE_URL` and use that in your code (requires code change to support it, or just stick to separate vars).
8.  Click **Create Web Service**.
9.  **Copy the Backend URL** (e.g., `https://anihub-api.onrender.com`).

---

## Step 4: Deploy Frontend (React/Vite)
1.  Click **New +** -> **Static Site**.
2.  Connect the same GitHub repository.
3.  **Root Directory**: `client`
4.  **Build Command**: `npm install && npm run build`
5.  **Publish Directory**: `dist`
6.  **Environment Variables**:
    -   `VITE_API_URL`: Paste your **Backend URL** + `/api` (e.g., `https://anihub-api.onrender.com/api`)
7.  Click **Create Static Site**.

---

## Step 5: Final Configuration
1.  Go back to your **Backend Service** settings.
2.  Add an environment variable `FRONTEND_URL` and set it to your **Frontend URL** (e.g., `https://anihub-frontend.onrender.com`).
    -   This is important for the CORS configuration in `server.js` to allow the frontend to talk to the backend.

## Step 6: Initialize Database
Since you need to create the tables in the cloud DB:
1.  Go to the **Backend Service** dashboard.
2.  Click on **Shell**.
3.  Run the seed script manually:
    ```bash
    node seed_db.js
    ```
    (Note: You might need to update `seed_db.js` or `.env` in the cloud slightly if it doesn't use the same env vars connection logic, but usually `pg` library supports `PGPASSWORD` etc. env vars too).

## Summary
-   **Database**: Holds your users and data.
-   **Backend**: API that talks to DB, hosted on a URL.
-   **Frontend**: React app that talks to Backend URL.

You are now live! 🚀
