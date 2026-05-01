# 🛍️ NovaMart — AI E-Commerce Web Portal

Full-stack e-commerce app with AI shopping assistant powered by Claude.

## Tech Stack
- **Frontend**: React 18 + Vite + React Router
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas (cloud)
- **AI**: Anthropic Claude API

---

## ⚡ Quick Start (Step by Step)

### Step 1 — Install Node.js
Download from https://nodejs.org → choose LTS version → install it.
Verify: open terminal and type `node -v`

### Step 2 — Get MongoDB Atlas URI (FREE)
1. Go to https://www.mongodb.com/atlas
2. Sign up for free
3. Create a cluster → click "Connect" → "Connect your application"
4. Copy the connection string (looks like: mongodb+srv://user:pass@cluster0.xxx.mongodb.net/)

### Step 3 — Get Anthropic API Key (for AI chat)
1. Go to https://console.anthropic.com
2. Sign up → go to API Keys → create a key
3. Copy it (starts with sk-ant-...)

### Step 4 — Configure Environment
Open `backend/.env` and replace:
- `YOUR_USERNAME:YOUR_PASSWORD` → your MongoDB Atlas credentials
- `cluster0.xxxxx` → your actual cluster address
- `sk-ant-YOUR_KEY_HERE` → your Anthropic API key

### Step 5 — Install & Run Backend
Open terminal in VS Code (Ctrl + `) → type:
```
cd backend
npm install
npm run dev
```
You should see: ✅ MongoDB Atlas connected + 🚀 Server running on http://localhost:5000

### Step 6 — Install & Run Frontend
Open a NEW terminal tab → type:
```
cd frontend
npm install
npm run dev
```
You should see: ➜ Local: http://localhost:5173

### Step 7 — Open in Browser
Go to http://localhost:5173

---

## 👤 Create Admin Account
1. Register normally at /register
2. Go to MongoDB Atlas → Browse Collections → users collection
3. Find your user → change `role` from "user" to "admin"
4. Log out and log back in → you'll see "Admin" in the navbar

---

## 📁 Project Structure
```
novamart/
├── backend/
│   ├── models/          ← MongoDB schemas
│   ├── routes/          ← API endpoints
│   ├── middleware/       ← JWT auth
│   ├── server.js        ← Express server
│   └── .env             ← YOUR CREDENTIALS GO HERE
└── frontend/
    └── src/
        ├── components/  ← Navbar, Cart, AI Chat, UI
        ├── pages/       ← Home, Product, Auth, Orders, Admin
        └── context/     ← Auth & Cart state
```

## 🔗 API Endpoints
- POST /api/auth/register  — create account
- POST /api/auth/login     — login
- GET  /api/products       — list products (auto-seeded)
- POST /api/orders         — place order
- POST /api/ai/chat        — AI assistant
- GET  /api/admin/stats    — dashboard (admin only)
