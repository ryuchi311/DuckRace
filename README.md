# 🦆 Ultimate Character Duck Race — Championship Edition

A 60FPS interactive Duck Race web app featuring **24 custom RPG & Pop-Culture Duck Archetypes**, **100-Racer Championship Support**, **10 Live TV Broadcast Camera POVs**, **Authentic MyInstants Quack Audio & Procedural Arcade Music**, and **Zero-Database Real-Time IRL QR Code Stage Joining**.

## ✨ Features
- **100-Participant Championship Grid**: Bulk paste 1–100 names (CSV, Excel, or line-by-line) and save automatically to `localStorage`.
- **📡 Host Realtime IRL QR Race (Empty Track Mode)**: Clear the track and let live audience members scan the on-screen QR code on their phones (over 4G/5G or Wi-Fi via zero-config PeerJS WebRTC relay) to spawn their chosen character duck live onto the starting gate until the host starts the race!
- **🎬 10 Live Broadcast Camera POVs + AI Auto-Director**: Switch between Leader Pan, Duck-Eye GoPro POV, 3D Sky-Drone, 3D Kart Chase, Helicopter Orbit, Underdog Cam, Mid-Pack Brawl, Photo-Finish Booth, Triple Split-Screen, and Blimp Map.
- **🔊 Authentic Quack SFX & Chiptune BGM**: Uses the classic `quack.mp3` sound with dynamic pitch/emotion expressions (`excited`, `surprised`, `dizzy`, `victory`, `angry`, `sad`, `happy`) + procedural arcade music.

## 🚀 Run Locally
```bash
node server.js
```
Then open `http://localhost:3000` in your browser.

## 🌐 Deploy to GitHub Pages
1. Push this repository to GitHub (`main` branch).
2. In your GitHub repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions** (or **Deploy from a branch → `main` / `/ (root)`**).
4. Your live Duck Race URL will be published at `https://<your-username>.github.io/<repo-name>/` — and the **QR Code Stage Join** will automatically use that live URL for phones!
