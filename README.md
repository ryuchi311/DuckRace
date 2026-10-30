# 🦆 Ultimate Duck Race — Championship Web App

An interactive, broadcast-quality Duck Race simulation and live party game. Players can customize up to 100 racers, host real-time IRL QR code lobbies, cheer for their ducks live from smartphones, and broadcast with 10 multi-camera POVs.

---

## 📁 Project Architecture & Folder Structure

```
DuckRace/
├── public/                  # Static assets served at Cloudflare Edge & web roots
│   ├── index.html           # Main web application & responsive HUD
│   ├── engine.js            # Physics simulation, renderer, AI & audio synthesizer
│   └── quack.mp3            # Audio fallback asset
│
├── src/                     # Application source code
│   ├── db/                  # Database definitions
│   │   └── schema.sql       # Cloudflare D1 SQL schema (rooms & participants)
│   ├── server/              # Node.js standalone / container server
│   │   └── index.js         # HTTP server with debounced JSON database engine
│   └── worker/              # Cloudflare Worker edge API
│       └── index.js         # Serverless API endpoints for Cloudflare D1 & KV
│
├── .github/
│   └── workflows/           # Automated deployment workflows (GitHub Pages)
│
├── wrangler.toml            # Cloudflare Worker & D1 Database configuration
├── package.json             # Scripts & metadata
├── server.js                # Root entry point alias for Node.js hosting (Railway/Render)
└── README.md                # Documentation & deployment guide
```

---

## 🚀 Quick Deployment Options

### 1. Cloudflare Workers + D1 Database (Fastest Serverless Hosting)
1. **Initialize or bind database:**
   ```bash
   npx wrangler d1 create duck-race-db
   ```
2. **Deploy to Cloudflare:**
   ```bash
   npm run deploy
   ```

### 2. Standalone Node.js (Railway / Render / Local Machine)
1. **Run locally or in container:**
   ```bash
   npm start
   ```
   * Automatically persists active rooms to `database.json`.
   * Automatically detects Wi-Fi LAN IP for local audience QR code scanning.

---

## 🎮 Key Features
* **Independent Obstacle Difficulties**: Choose between 🟢 **Easy**, 🔵 **Normal**, 🟠 **Hard**, and 🔴 **Chaos** independently from the arena map.
* **4 Arena Map Themes**: River Rapids, Pixel Ocean, Cyber Stream, and Lava Moat.
* **Audience Stage Passes**: Audience members scan a QR code with their mobile cameras, pick character ducks, and tap **Quack Boost** live to cheer.
* **Legal & Privacy Suite**: In-app COPPA 13+ age gate, GDPR consent preferences, DMCA takedown intake, and California ARL terms.
