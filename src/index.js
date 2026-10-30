export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS preflight handling
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    const corsHeaders = {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store'
    };

    // -----------------------------------------------------------
    // 1. GET /api/stage-state?pin=DUCK (Read room state from KV)
    // -----------------------------------------------------------
    if (pathname === '/api/stage-state' && request.method === 'GET') {
      const pin = (url.searchParams.get('pin') || 'DUCK').toUpperCase();
      let participants = [];

      try {
        if (env && env.DUCK_ROOMS_KV) {
          const raw = await env.DUCK_ROOMS_KV.get(`room:${pin}`);
          if (raw) participants = JSON.parse(raw);
        }
      } catch (err) {
        console.warn('KV read error:', err.message);
      }

      const publicOrigin = `${url.protocol}//${url.host}`;

      return new Response(JSON.stringify({
        ok: true,
        pin,
        serverTime: Date.now(),
        lanOrigin: publicOrigin,
        publicOrigin: publicOrigin,
        participants
      }), { status: 200, headers: corsHeaders });
    }

    // -----------------------------------------------------------
    // 2. POST /api/stage-join (Join or Quack Boost room in KV)
    // -----------------------------------------------------------
    if (pathname === '/api/stage-join' && request.method === 'POST') {
      let body = {};
      try {
        body = await request.json();
      } catch (e) {
        body = {};
      }

      const pin = String(body.roomPin || 'DUCK').toUpperCase();
      let participants = [];

      try {
        if (env && env.DUCK_ROOMS_KV) {
          const raw = await env.DUCK_ROOMS_KV.get(`room:${pin}`);
          if (raw) participants = JSON.parse(raw);
        }
      } catch (err) {}

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

        // Save to Cloudflare KV with 4-hour automatic expiration TTL
        try {
          if (env && env.DUCK_ROOMS_KV) {
            await env.DUCK_ROOMS_KV.put(`room:${pin}`, JSON.stringify(participants), {
              expirationTtl: 4 * 3600 // auto-cleanup after 4 hours
            });
          }
        } catch (err) {
          console.warn('KV put error:', err.message);
        }
      }

      return new Response(JSON.stringify({
        ok: true,
        pin,
        participants
      }), { status: 200, headers: corsHeaders });
    }

    // -----------------------------------------------------------
    // 3. POST /api/stage-clear (Clear room in KV)
    // -----------------------------------------------------------
    if (pathname === '/api/stage-clear' && request.method === 'POST') {
      let body = {};
      try {
        body = await request.json();
      } catch (e) {}

      const pin = String(body.roomPin || 'DUCK').toUpperCase();

      try {
        if (env && env.DUCK_ROOMS_KV) {
          await env.DUCK_ROOMS_KV.delete(`room:${pin}`);
        }
      } catch (e) {}

      return new Response(JSON.stringify({
        ok: true,
        pin,
        participants: []
      }), { status: 200, headers: corsHeaders });
    }

    // -----------------------------------------------------------
    // 4. Healthcheck
    // -----------------------------------------------------------
    if (pathname === '/healthz' || pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        platform: 'Cloudflare Workers',
        kvEnabled: !!(env && env.DUCK_ROOMS_KV),
        time: Date.now()
      }), { status: 200, headers: corsHeaders });
    }

    // -----------------------------------------------------------
    // 5. Cloudflare Workers Static Assets Fallback
    // -----------------------------------------------------------
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('404 Not Found', { status: 404 });
  }
};
