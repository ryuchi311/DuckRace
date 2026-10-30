// ============================================================================
// CLOUDFLARE WORKER: DUCK RACE API & EDGE STATIC ASSETS (src/worker/index.js)
// Supports both Cloudflare D1 (SQL) and Cloudflare KV as fallback
// ============================================================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    // 24-hour auto cleanup: purge records older than 24 hours (86,400,000 ms)
    const cleanupOldData = async () => {
      if (!env.DB) return;
      try {
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        await env.DB.prepare(`DELETE FROM participants WHERE joined_at < ?`).bind(cutoff).run();
        await env.DB.prepare(`DELETE FROM rooms WHERE updated_at < ?`).bind(cutoff).run();
      } catch (e) {}
    };

    // Auto-create D1 schema if D1 database binding is present
    const initD1 = async () => {
      if (!env.DB) return;
      try {
        await env.DB.batch([
          env.DB.prepare(`CREATE TABLE IF NOT EXISTS rooms (pin TEXT PRIMARY KEY, created_at INTEGER, updated_at INTEGER)`),
          env.DB.prepare(`CREATE TABLE IF NOT EXISTS participants (
            room_pin TEXT NOT NULL,
            participant_id TEXT NOT NULL,
            player_name TEXT NOT NULL,
            duck_id TEXT NOT NULL,
            battle_cry TEXT,
            joined_at INTEGER,
            last_boost_at INTEGER,
            PRIMARY KEY (room_pin, participant_id)
          )`),
          env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_participants_room ON participants(room_pin)`),
          env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_participants_joined ON participants(joined_at)`)
        ]);
        await cleanupOldData();
      } catch (e) {}
    };

    // -----------------------------------------------------------
    // 1. GET /api/stage-state?pin=DUCK
    // -----------------------------------------------------------
    if (pathname === '/api/stage-state' && request.method === 'GET') {
      const pin = (url.searchParams.get('pin') || 'DUCK').trim().toUpperCase();
      let participants = [];
      let dbType = 'In-Memory / None';

      // 1A. Try Cloudflare D1 (SQL)
      if (env && env.DB) {
        dbType = 'Cloudflare D1 (SQL)';
        try {
          await initD1();
          const { results } = await env.DB.prepare(
            `SELECT participant_id as participantId, room_pin as roomPin, player_name as playerName,
                    duck_id as duckId, battle_cry as battleCry, joined_at as joinedAt, last_boost_at as lastBoostAt
             FROM participants
             WHERE room_pin = ?
             ORDER BY joined_at ASC`
          ).bind(pin).all();
          participants = results || [];
        } catch (e) {}
      }
      // 1B. Fallback to Cloudflare KV (auto-expiring 24 hours TTL)
      else if (env && env.DUCK_ROOMS_KV) {
        dbType = 'Cloudflare KV (24h TTL)';
        try {
          const raw = await env.DUCK_ROOMS_KV.get(`room:${pin}`);
          if (raw) participants = JSON.parse(raw);
        } catch (e) {}
      }

      const publicOrigin = `${url.protocol}//${url.host}`;

      return new Response(JSON.stringify({
        ok: true,
        pin,
        database: dbType,
        serverTime: Date.now(),
        lanOrigin: publicOrigin,
        publicOrigin: publicOrigin,
        participants
      }), { headers: corsHeaders });
    }

    // -----------------------------------------------------------
    // 2. POST /api/stage-join
    // -----------------------------------------------------------
    if (pathname === '/api/stage-join' && request.method === 'POST') {
      try {
        const body = await request.json();
        const pin = String(body.roomPin || 'DUCK').trim().toUpperCase();
        let participants = [];

        if (body.participantId) {
          const now = Date.now();
          const record = {
            participantId: String(body.participantId),
            roomPin: pin,
            playerName: String(body.playerName || 'Stage Duck').slice(0, 40),
            duckId: String(body.duckId || 'priest'),
            battleCry: String(body.battleCry || 'QUACK!').slice(0, 50),
            joinedAt: Number(body.joinedAt) || now,
            lastBoostAt: Number(body.lastBoostAt) || 0
          };

          // 2A. Cloudflare D1 Database Write
          if (env && env.DB) {
            await initD1();
            await env.DB.prepare(`
              INSERT INTO participants (room_pin, participant_id, player_name, duck_id, battle_cry, joined_at, last_boost_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(room_pin, participant_id) DO UPDATE SET
                player_name = excluded.player_name,
                duck_id = excluded.duck_id,
                battle_cry = excluded.battle_cry,
                last_boost_at = excluded.last_boost_at
            `).bind(
              record.roomPin,
              record.participantId,
              record.playerName,
              record.duckId,
              record.battleCry,
              record.joinedAt,
              record.lastBoostAt
            ).run();

            const { results } = await env.DB.prepare(
              `SELECT participant_id as participantId, room_pin as roomPin, player_name as playerName,
                      duck_id as duckId, battle_cry as battleCry, joined_at as joinedAt, last_boost_at as lastBoostAt
               FROM participants
               WHERE room_pin = ?
               ORDER BY joined_at ASC`
            ).bind(pin).all();
            participants = results || [];
          }
          // 2B. Cloudflare KV Write
          else if (env && env.DUCK_ROOMS_KV) {
            try {
              const raw = await env.DUCK_ROOMS_KV.get(`room:${pin}`);
              if (raw) participants = JSON.parse(raw);
            } catch (e) {}

            const idx = participants.findIndex(p => p.participantId === body.participantId);
            if (idx >= 0) participants[idx] = record;
            else if (participants.length < 100) participants.push(record);

            await env.DUCK_ROOMS_KV.put(`room:${pin}`, JSON.stringify(participants), {
              expirationTtl: 24 * 3600 // Auto-deleted from KV after 24 hours
            });
          }
        }

        return new Response(JSON.stringify({ ok: true, pin, participants }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 400, headers: corsHeaders });
      }
    }

    // -----------------------------------------------------------
    // 3. POST /api/stage-clear
    // -----------------------------------------------------------
    if (pathname === '/api/stage-clear' && request.method === 'POST') {
      try {
        const body = await request.json();
        const pin = String(body.roomPin || 'DUCK').trim().toUpperCase();

        if (env && env.DB) {
          await initD1();
          await env.DB.prepare(`DELETE FROM participants WHERE room_pin = ?`).bind(pin).run();
        } else if (env && env.DUCK_ROOMS_KV) {
          await env.DUCK_ROOMS_KV.delete(`room:${pin}`);
        }

        return new Response(JSON.stringify({ ok: true, pin, participants: [] }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 400, headers: corsHeaders });
      }
    }

    // -----------------------------------------------------------
    // 4. Cloud Healthcheck
    // -----------------------------------------------------------
    if (pathname === '/healthz' || pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        platform: 'Cloudflare Worker',
        hasD1: !!(env && env.DB),
        hasKV: !!(env && env.DUCK_ROOMS_KV),
        time: Date.now()
      }), { headers: corsHeaders });
    }

    // -----------------------------------------------------------
    // 5. Serve Static Assets from Cloudflare Static Assets Binding
    // -----------------------------------------------------------
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('404 Not Found', { status: 404 });
  }
};
