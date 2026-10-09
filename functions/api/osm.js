// Fonction Cloudflare Pages : données OpenStreetMap autour d'un point, par l'API Overpass.
// Côté serveur, aucune restriction de navigateur : on essaie plusieurs serveurs Overpass à la suite
// (ils sont souvent surchargés) et on garde la réponse en cache 24 h pour le même point.

const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];

const reply = (body, status, cacheable) => new Response(body, {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cacheable ? 'public, max-age=86400' : 'no-store' }
});

export async function onRequestGet({ request }) {
  const u = new URL(request.url);
  const lat = parseFloat(u.searchParams.get('lat')), lon = parseFloat(u.searchParams.get('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 85 || Math.abs(lon) > 180) return reply('{"error":"lat/lon invalides"}', 400, false);
  const la = lat.toFixed(5), lo = lon.toFixed(5);

  const key = new Request(`https://cache.local/osm/${la}/${lo}`);
  const cache = caches.default;
  const hit = await cache.match(key);
  if (hit) return hit;

  // rue la plus proche, écoles et établissements de santé à 400 m, passages, feux et arrêts à 150 m
  const q = `[out:json][timeout:25];
way(around:35,${la},${lo})[highway~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|living_street|service)(_link)?$"];
out tags geom;
nwr(around:400,${la},${lo})[amenity~"^(school|kindergarten|college|university|hospital|clinic)$"];
out tags geom;
node(around:150,${la},${lo})[highway~"^(crossing|traffic_signals|bus_stop)$"];
out body;`;

  const t0 = Date.now();
  for (let round = 0; round < 2 && Date.now() - t0 < 60000; round++) {
    for (const m of MIRRORS) {
      if (Date.now() - t0 > 60000) break;
      const ctrl = new AbortController(), tm = setTimeout(() => ctrl.abort(), 20000);
      try {
        const r = await fetch(m, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'urbain.ksr-infra.org (comparateur de moderation des vitesses)' },
          body: 'data=' + encodeURIComponent(q),
          signal: ctrl.signal
        });
        clearTimeout(tm);
        if (!r.ok) continue;
        const txt = await r.text();
        if (!txt.trim().startsWith('{')) continue;
        const out = reply(txt, 200, true);
        await cache.put(key, out.clone());
        return out;
      } catch (e) { clearTimeout(tm); }
    }
  }
  return reply('{"error":"serveurs Overpass indisponibles"}', 502, false);
}
