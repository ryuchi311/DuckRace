export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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

    // Auto-create D1 tables on first query if they don't exist yet
    const initDb = async () => {
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
          env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_participants_room ON participants(room_pin)`)
        ]);
      } catch (e) {}
    };

    // 1. GET /api/stage-state?pin=DUCK -> Query participants from Cloudflare D1 SQL
    if (url.pathname === '/api/stage-state' && request.method === 'GET') {
      const pin = (url.searchParams.get('pin') || 'DUCK').trim().toUpperCase();
      let participants = [];

      if (env.DB) {
        try {
          await initDb();
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

      return new Response(JSON.stringify({
        ok: true,
        pin,
        database: 'Cloudflare D1 (SQL)',
        participants
      }), { headers: corsHeaders });
    }

    // 2. POST /api/stage-join -> Insert or Update participant & Boost in Cloudflare D1 SQL
    if (url.pathname === '/api/stage-join' && request.method === 'POST') {
      try {
        const body = await request.json();
        const pin = String(body.roomPin || 'DUCK').trim().toUpperCase();

        if (env.DB && body.participantId) {
          await initDb();
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

          // Upsert into D1 SQL database
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

          // Fetch updated participant fleet
          const { results } = await env.DB.prepare(
            `SELECT participant_id as participantId, room_pin as roomPin, player_name as playerName,
                    duck_id as duckId, battle_cry as battleCry, joined_at as joinedAt, last_boost_at as lastBoostAt
             FROM participants
             WHERE room_pin = ?
             ORDER BY joined_at ASC`
          ).bind(pin).all();

          return new Response(JSON.stringify({ ok: true, pin, participants: results || [] }), { headers: corsHeaders });
        }

        return new Response(JSON.stringify({ ok: true, pin, participants: [] }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 400, headers: corsHeaders });
      }
    }

    // 3. POST /api/stage-clear -> Clear room participants in Cloudflare D1 SQL
    if (url.pathname === '/api/stage-clear' && request.method === 'POST') {
      try {
        const body = await request.json();
        const pin = String(body.roomPin || 'DUCK').trim().toUpperCase();
        if (env.DB) {
          await initDb();
          await env.DB.prepare(`DELETE FROM participants WHERE room_pin = ?`).bind(pin).run();
        }
        return new Response(JSON.stringify({ ok: true, pin, participants: [] }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 400, headers: corsHeaders });
      }
    }

    // Default: Serve game static assets
    return env.ASSETS.fetch(request);
  }
};
