const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'database.json');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

// ============================================================================
// 1. JSON DATABASE ENGINE (Persistent & Crash-Resilient)
// ============================================================================

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.rooms === 'object') {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`[DB] Notice reading ${DB_FILE}: ${err.message}. Initializing clean database.`);
  }
  return {
    version: 1,
    rooms: {},
    lastUpdated: Date.now()
  };
}

let db = loadDatabase();
let saveTimeout = null;

// Debounced file write to protect disk performance during rapid Quack Boost clicks
function saveDatabase() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      db.lastUpdated = Date.now();
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), 'utf8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('[DB] Failed to save database.json:', err.message);
    }
  }, 250);
}

// Automatic cleanup: prune rooms that have been inactive for more than 4 hours
setInterval(() => {
  const cutoff = Date.now() - 4 * 60 * 60 * 1000;
  let changed = false;
  for (const pin in db.rooms) {
    const list = db.rooms[pin];
    if (Array.isArray(list)) {
      const active = list.filter(p => (p.lastBoostAt || p.joinedAt || 0) > cutoff);
      if (active.length !== list.length) {
        db.rooms[pin] = active;
        changed = true;
      }
      if (active.length === 0) {
        delete db.rooms[pin];
        changed = true;
      }
    }
  }
  if (changed) saveDatabase();
}, 15 * 60 * 1000);

// ============================================================================
// 2. NETWORK & PUBLIC CLOUD URL RESOLUTION
// ============================================================================

function getLocalLanIp() {
  const nets = os.networkInterfaces();
  let fallbackIp = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        if (net.address.startsWith('192.168.') || net.address.startsWith('10.') || net.address.startsWith('172.')) {
          return net.address;
        }
        fallbackIp = net.address;
      }
    }
  }
  return fallbackIp;
}

// Detect whether running behind a cloud proxy (Railway, Render, Fly.io, Heroku) or on local Wi-Fi
function resolvePublicOrigin(req) {
  // If explicitly configured via environment variable (e.g. PUBLIC_URL=https://duckrace.up.railway.app)
  if (process.env.PUBLIC_URL) {
    return process.env.PUBLIC_URL.replace(/\/$/, '');
  }

  const hostHeader = req.headers['x-forwarded-host'] || req.headers.host || '';
  const protoHeader = req.headers['x-forwarded-proto'] || (req.socket.encrypted ? 'https' : 'http');

  // If request contains a standard cloud/custom host
  if (hostHeader && !hostHeader.startsWith('localhost') && !hostHeader.startsWith('127.0.0.1')) {
    return `${protoHeader}://${hostHeader}`;
  }

  // Local development fallback: use Wi-Fi LAN IP so phones on the same network can join directly
  const lanIp = getLocalLanIp();
  return `http://${lanIp}:${PORT}`;
}

// ============================================================================
// 3. HTTP HELPERS
// ============================================================================

function readJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) req.connection.destroy();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

// ============================================================================
// 4. REQUEST ROUTER
// ============================================================================

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const reqPath = parsedUrl.pathname;

  // 1. Real-Time Stage Room State Endpoint
  if (reqPath === '/api/stage-state' && req.method === 'GET') {
    const pin = (parsedUrl.searchParams.get('pin') || 'DUCK').toUpperCase();
    const list = db.rooms[pin] || [];
    const origin = resolvePublicOrigin(req);
    sendJson(res, 200, {
      ok: true,
      pin,
      serverTime: Date.now(),
      lanOrigin: origin,
      publicOrigin: origin,
      participants: list
    });
    return;
  }

  // 2. Real-Time Stage Participant Join or Live Cheer Boost Endpoint
  if (reqPath === '/api/stage-join' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const pin = String(body.roomPin || 'DUCK').toUpperCase();
    if (!db.rooms[pin]) db.rooms[pin] = [];
    const roomList = db.rooms[pin];

    if (body.participantId) {
      const idx = roomList.findIndex(p => p.participantId === body.participantId);
      const record = {
        participantId: String(body.participantId),
        roomPin: pin,
        playerName: String(body.playerName || 'Stage Duck').slice(0, 40),
        duckId: String(body.duckId || 'priest'),
        battleCry: String(body.battleCry || 'QUACK!').slice(0, 50),
        joinedAt: Number(body.joinedAt) || Date.now(),
        lastBoostAt: Number(body.lastBoostAt) || 0
      };
      if (idx >= 0) {
        roomList[idx] = record;
      } else if (roomList.length < 100) {
        roomList.push(record);
      }
      saveDatabase();
    }

    sendJson(res, 200, { ok: true, pin, participants: roomList });
    return;
  }

  // 3. Clear Stage Room Endpoint
  if (reqPath === '/api/stage-clear' && req.method === 'POST') {
    const body = await readJsonBody(req);
    const pin = String(body.roomPin || 'DUCK').toUpperCase();
    db.rooms[pin] = [];
    saveDatabase();
    sendJson(res, 200, { ok: true, pin, participants: [] });
    return;
  }

  // 4. Cloud Healthcheck Endpoint (Used by Railway, Render, Fly.io, AWS)
  if (reqPath === '/healthz' || reqPath === '/api/health') {
    sendJson(res, 200, {
      status: 'ok',
      uptime: process.uptime(),
      dbVersion: db.version,
      roomsActive: Object.keys(db.rooms).length
    });
    return;
  }

  // 5. Static File Server
  let filePath = reqPath === '/' ? '/index.html' : reqPath;
  filePath = path.join(__dirname, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const lanIp = getLocalLanIp();
  console.log(`====================================================`);
  console.log(`🦆 Ultimate Duck Race Server Running`);
  console.log(`  - Local:       http://localhost:${PORT}`);
  console.log(`  - Network:     http://${lanIp}:${PORT}`);
  console.log(`  - Database:    ${DB_FILE}`);
  console.log(`  - Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`====================================================`);
});
