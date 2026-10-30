export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers for mobile clients & web app
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

    // 1. GET /api/stage-state?pin=DUCK -> Read participants from Cloudflare KV database
    if (url.pathname === '/api/stage-state' && request.method === 'GET') {
      const pin = (url.searchParams.get('pin') || 'DUCK').trim().toUpperCase();
      let participants = [];
      try {
        const stored = await env.ROOMS.get(`room:${pin}`, { type: 'json' });
        if (Array.isArray(stored)) {
          participants = stored;
        }
      } catch (e) {}

      return new Response(JSON.stringify({
        ok: true,
        pin,
        onlineDb: 'Cloudflare KV (ROOMS)',
        participants
      }), { headers: corsHeaders });
    }

    // 2. POST /api/stage-join -> Add/Update participant or Live Quack Boost in KV
    if (url.pathname === '/api/stage-join' && request.method === 'POST') {
      try {
        const body = await request.json();
        const pin = String(body.roomPin || 'DUCK').trim().toUpperCase();
        let participants = [];
        try {
          const stored = await env.ROOMS.get(`room:${pin}`, { type: 'json' });
          if (Array.isArray(stored)) participants = stored;
        } catch (e) {}

        if (body.participantId) {
          const idx = participants.findIndex(p => p.participantId === body.participantId);
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
            participants[idx] = record;
          } else if (participants.length < 100) {
            participants.push(record);
          }

          // Auto-expire room after 24 hours of inactivity
          await env.ROOMS.put(`room:${pin}`, JSON.stringify(participants), { expirationTtl: 86400 });
        }

        return new Response(JSON.stringify({ ok: true, pin, participants }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 400, headers: corsHeaders });
      }
    }

    // 3. POST /api/stage-clear -> Clear room participants in KV
    if (url.pathname === '/api/stage-clear' && request.method === 'POST') {
      try {
        const body = await request.json();
        const pin = String(body.roomPin || 'DUCK').trim().toUpperCase();
        await env.ROOMS.delete(`room:${pin}`);
        return new Response(JSON.stringify({ ok: true, pin, participants: [] }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 400, headers: corsHeaders });
      }
    }

    // Default: Serve static assets (HTML, JS, audio)
    return env.ASSETS.fetch(request);
  }
};

