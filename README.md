# 🦆 Ultimate Duck Race — Championship Web App

An interactive, broadcast-quality Duck Race simulation and live party game built for Cloudflare Workers/Pages and standalone Node.js servers. Host up to 100 customizable character ducks, run fair real-time IRL QR code lobbies, track live spectators, and broadcast with 10 multi-camera POVs.

---

## 📁 Project Architecture & Folder Structure

```text
DuckRace/
├── public/                              # Static assets served at Cloudflare Edge & web roots
│   ├── index.html                       # Main web application & two-row Broadcast Director HUD
│   ├── ultimate_character_duck_race.html# Standalone mirror of the main application
│   ├── engine.js                        # Physics simulation, renderer, AI, exports & audio synth
│   ├── favicon.svg                      # Vector duck app icon
│   ├── thumbnail.svg                    # Social preview / OpenGraph vector banner
│   ├── instapay-qr.jpg                  # Tip jar / support QR code asset
│   └── quack.mp3                        # Audio fallback asset
│
├── src/                                 # Application source code
│   ├── db/                              # Database definitions
│   │   └── schema.sql                   # Cloudflare D1 SQL schema (rooms, participants, viewers)
│   ├── public/                          # Source static assets mirror
│   ├── server/                          # Node.js standalone / container server
│   │   └── index.js                     # HTTP server with debounced JSON database & device anti-cheat
│   └── worker/                          # Cloudflare Worker edge API
│       └── index.js                     # Serverless API endpoints for Cloudflare D1, KV & static assets
│
├── index.html                           # Root web application entry point
├── ultimate_character_duck_race.html    # Root standalone application mirror
├── engine.js                            # Root physics, rendering, roster & export engine
├── server.js                            # Root entry point for Node.js hosting (Railway/Render/Local)
├── schema.sql                           # Root D1 SQL schema mirror
├── wrangler.toml                        # Cloudflare Worker (`duckrace`) & static assets configuration
├── package.json                         # Build, local dev & Cloudflare deployment scripts
├── run.bat                              # One-click Windows local launcher
└── README.md                            # Documentation & deployment guide
```

---

## 🚀 Running & Deployment

### 1. Run Locally (Windows — One Click)
Double-click [`run.bat`](file:///c:/DuckRace/run.bat) in the project root or run from Terminal:
```cmd
run.bat
```
* Verifies that Node.js is installed.
* Starts the local server on `http://localhost:3000`.
* Automatically opens your default web browser to the game.

### 2. Standalone Node.js (Railway / Render / Local Machine)
```bash
npm start
```
* Automatically persists active rooms and participants to `database.json` (auto-purged after 24 hours).
* Automatically detects your Wi-Fi LAN IP for local audience QR code scanning.
* Enforces one participant join per device/IP per room (`409 DUPLICATE_DEVICE` protection).

### 3. Cloudflare Workers + D1 Database (Serverless Edge Hosting)
1. **Sync static build files into `public/` (if edited at root):**
   ```bash
   npm run build
   ```
2. **Initialize D1 database (optional, for persistent edge storage):**
   ```bash
   npx wrangler d1 create duck-race-db
   npm run db:init:remote
   ```
3. **Deploy to Cloudflare Workers (`duckrace`):**
   ```bash
   npm run deploy
   ```

---

## 🎮 Key Features

* **Two-Row Broadcast Director HUD**: Structured telemetry console with live race metrics, 10 dynamic camera angles (Leader Cam, Pack Cam, Heli Cam, Drone POV, Photo Finish, Free Roam, etc.), and quick-access action clusters.
* **Interactive 4-Step Onboarding Tour**: Automatic guided walkthrough for first-time visitors explaining roster customization, obstacle difficulty, IRL QR lobby hosting, and race controls (accessible anytime from the HUD).
* **Fair IRL / QR Audience Stage Lobby**:
  * **Dynamic Room PINs**: Generates a unique 4-character room PIN per session (or accepts `?pin=XXXX`).
  * **Mobile Character Picker**: Audience members scan the stage QR code, get a randomized default character duck, enter their display name, custom battle cry, and **required Notes / Contact Info** (e.g., email, GCash, or reward claim details).
  * **Fair Stage-Only Racing**: Mobile mid-race boosting is disabled so every entrant competes on equal footing, backed by single-device-per-room join protection.
* **Real-Time Live Visitor & Spectator Counter**: Tracks active connected viewers and displays live spectator telemetry in the HUD.
* **Roster Management & Multi-Format Exports**:
  * **Excel / CSV Import & Export**: Import participant rosters directly from `.xlsx`, `.xls`, or `.csv` spreadsheets and export current rosters or final race standings.
  * **Duplicate Name Detector**: Real-time warning banner in the Bulk Editor with one-click **Remove Duplicates** cleanup.
  * **Complete Race Exports**: Export final standings with participant **Notes** included across CSV, Excel, JSON, TXT, and printable HTML formats.
* **Independent Obstacle Difficulties & 4 Arena Themes**:
  * Choose between 🟢 **Easy**, 🔵 **Normal**, 🟠 **Hard**, and 🔴 **Chaos** obstacle density independently of the map theme.
  * Race across **River Rapids**, **Pixel Ocean**, **Cyber Stream**, and **Lava Moat**.
* **Cross-Promo & Creator Support**: Built-in animated **Game of Wheel** cross-promotion link and support/tip modal.
* **Legal & Privacy Suite**: In-app COPPA 13+ age gate, GDPR consent preferences, DMCA takedown intake, and terms of service modals.
