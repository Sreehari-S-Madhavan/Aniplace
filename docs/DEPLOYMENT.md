# 🚀 Simple Vercel Deployment Guide

This guide will help you deploy your app to Vercel for free.

## Part 1: The Database (Neon Postgres)
Since you couldn't find "Postgres" in Vercel, let's go directly to the source. **Neon** is the company that provides Vercel's database. It is free.

1.  Go to **[neon.tech](https://neon.tech)** and **Sign Up**.
2.  Create a **New Project**. Name it `anihub`.
3.  It will show you a **Connection String** immediately.
    *   It looks like: `postgres://user:password@ep-something.aws.neon.tech/neondb?sslmode=require`
    *   **COPY THIS STRING.**
    *   Save it in a notepad for a moment.

---

## Part 2: Deploy Backend (Server)
1.  Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub Repository: `Aniplace`.
4.  **Configure the Project**:
    *   **Project Name**: `anihub-server`
    *   **Root Directory**: Click "Edit" and select `server`.
    *   **Environment Variables**: Click to expand.
        *   **Key**: `DATABASE_URL`
        *   **Value**: Paste the Neon Connection String you copied in Part 1.
        *   *(Click Add)*
        *   **Key**: `JWT_SECRET`
        *   **Value**: `mysecretpassword123` (or anything you want)
        *   *(Click Add)*
5.  Click **Deploy**.
6.  Wait for it to turn Green.
7.  **Copy the Domain** (e.g., `https://anihub-server.vercel.app`).

---

## Part 3: Deploy Frontend (Client)
1.  Go to Vercel Dashboard -> **"Add New..."** -> **"Project"**.
2.  Import `Aniplace` again.
3.  **Configure the Project**:
    *   **Project Name**: `anihub-client`
    *   **Root Directory**: Click "Edit" and select `client`.
    *   **Framework Preset**: It should say "Vite".
    *   **Environment Variables**:
        *   **Key**: `VITE_API_URL`
        *   **Value**: Paste your Backend URL from Part 2 **and add `/api` at the end**.
        *   *Example*: `https://anihub-server.vercel.app/api`
4.  Click **Deploy**.
5.  Wait for it to turn Green.
6.  **Copy the Domain** (e.g., `https://anihub-client.vercel.app`).

---

## Part 4: Connect Them
The backend needs to know about the new frontend URL to allow connections (CORS).

1.  Go to your **Backend** project in Vercel.
2.  Click **Settings** -> **Environment Variables**.
3.  Add a new variable:
    *   **Key**: `FRONTEND_URL`
    *   **Value**: Your Frontend URL (e.g., `https://anihub-client.vercel.app`)
4.  Click **Save**.
5.  Go to **Deployments** tab -> Click the "..." on the latest deployment -> **Redeploy**.

---

## Part 5: Initialize the Database (One-time)
Your database is empty. Let's fill it using your local computer.

1.  Open your project in **VS Code**.
2.  Open `server/.env`.
3.  Add/Replace the `DATABASE_URL` line with your **Neon Connection String**:
    ```text
    DATABASE_URL="postgres://user:password@..."
    ```
4.  Open the terminal in VS Code:
    ```bash
    cd server
    npm run seed
    ```
5.  If it says **"✅ Data seeded successfully"**, you are done!
