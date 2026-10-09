// Fonction Cloudflare Pages : densité de population autour d'un point (WorldPop 2020, jeu wpgppop).
// Le navigateur ne peut pas interroger WorldPop directement (pas d'en-têtes CORS) : la page appelle
// /api/pop?lat=..&lon=..&r=300 et cette fonction dépose la tâche chez WorldPop puis attend le résultat.

const STATS = 'https://api.worldpop.org/v1/services/stats';
const TASKS = 'https://api.worldpop.org/v1/tasks/';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': status === 200 ? 'public, max-age=86400' : 'no-store' }
});
const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function onRequestGet({ request }) {
  const u = new URL(request.url);
  const lat = parseFloat(u.searchParams.get('lat')), lon = parseFloat(u.searchParams.get('lon'));
  const r = Math.min(1000, Math.max(50, parseFloat(u.searchParams.get('r') || '300')));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 85 || Math.abs(lon) > 180) return json({ ok: false, error: 'lat/lon invalides' }, 400);

  // cache : même point (à ~10 m près) et même rayon
  const key = new Request(`https://cache.local/pop/${lat.toFixed(4)}/${lon.toFixed(4)}/${r}`);
  const cache = caches.default;
  const hit = await cache.match(key);
  if (hit) return hit;

  // cercle approché par un polygone de 32 côtés
  const ring = [];
  for (let i = 0; i <= 32; i++) {
    const a = 2 * Math.PI * i / 32;
    ring.push([lon + r * Math.cos(a) / (111320 * Math.cos(lat * Math.PI / 180)), lat + r * Math.sin(a) / 110540]);
  }
  const geojson = JSON.stringify({ type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [ring] } }] });

  let taskid = null;
  for (let k = 0; k < 3 && !taskid; k++) {
    try {
      const res = await fetch(STATS, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ dataset: 'wpgppop', year: '2020', geojson }) });
      const j = await res.json();
      if (j && j.taskid) taskid = j.taskid;
    } catch (e) { await sleep(1500); }
  }
  if (!taskid) return json({ ok: false, error: 'WorldPop injoignable' }, 502);

  const t0 = Date.now();
  while (Date.now() - t0 < 75000) {
    await sleep(2500);
    try {
      const j = await (await fetch(TASKS + encodeURIComponent(taskid))).json();
      if (j.error === true || /fail|error/i.test(j.status || '')) return json({ ok: false, error: 'tâche WorldPop en échec' }, 502);
      if (j.status === 'finished' && j.data && typeof j.data.total_population === 'number') {
        const areaHa = Math.PI * r * r / 1e4, pop = j.data.total_population;
        const out = json({ ok: true, pop, areaHa, density: pop / areaHa, radius: r, dataset: 'wpgppop', year: 2020 });
        await cache.put(key, out.clone());
        return out;
      }
    } catch (e) { /* nouvel essai */ }
  }
  return json({ ok: false, error: 'délai WorldPop dépassé' }, 504);
}
