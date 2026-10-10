// Fonction Cloudflare Pages : archive des projets enregistrés.
// POST : appelée à chaque « Enregistrer le projet » ; garde une copie du projet avec l'adresse IP, le pays,
//        la date et le navigateur de l'ordinateur qui a enregistré.
// GET  : réservé à l'administrateur (clé ADMIN_KEY) ; liste des enregistrements, ou un projet (?id=…).
// Prérequis Cloudflare : un espace KV lié sous le nom URB_PROJETS et une variable secrète ADMIN_KEY.

const MAX = 2 * 1024 * 1024;   // 2 Mo par projet

const json = (obj, status = 200, extra = {}) => new Response(JSON.stringify(obj), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra }
});

export async function onRequestPost({ request, env }) {
  if (!env.URB_PROJETS) return json({ stored: false, error: 'archive non configurée' }, 503);
  const txt = await request.text();
  if (txt.length > MAX) return json({ stored: false, error: 'projet trop volumineux' }, 413);
  let p;
  try { p = JSON.parse(txt); } catch (e) { return json({ stored: false, error: 'JSON invalide' }, 400); }
  if (!p || p.kind !== 'urb-projet') return json({ stored: false, error: 'fichier inconnu' }, 400);
  const now = new Date().toISOString();
  const id = `${now}-${crypto.randomUUID().slice(0, 8)}`;
  const m = p.meta || {}, cut = s => String(s || '').slice(0, 80);
  const metadata = {
    date: now,
    ip: request.headers.get('CF-Connecting-IP') || '',
    pays: (request.cf && request.cf.country) || '',
    ville: (request.cf && request.cf.city) || '',
    commune: cut(m.commune), lieu: cut(m.lieu), auteur: cut(m.auteur),
    module: p.module === 'jx' ? 'carrefour' : 'traversée',
    langue: cut(p.lang), taille: txt.length,
    navigateur: cut(request.headers.get('User-Agent'))
  };
  await env.URB_PROJETS.put(id, txt, { metadata });
  return json({ stored: true, id });
}

export async function onRequestGet({ request, env }) {
  const u = new URL(request.url);
  const key = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '') || u.searchParams.get('key') || '';
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) return json({ error: 'accès refusé' }, 401);
  if (!env.URB_PROJETS) return json({ error: 'archive non configurée' }, 503);
  const id = u.searchParams.get('id');
  if (id) {
    const v = await env.URB_PROJETS.get(id);
    if (v === null) return json({ error: 'introuvable' }, 404);
    return new Response(v, { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Disposition': `attachment; filename="urb-archive-${id.replace(/[^\w-]/g, '')}.json"` } });
  }
  const items = [];
  let cursor;
  do {
    const r = await env.URB_PROJETS.list({ cursor, limit: 1000 });
    for (const k of r.keys) items.push({ id: k.name, ...(k.metadata || {}) });
    cursor = r.list_complete ? null : r.cursor;
  } while (cursor && items.length < 5000);
  items.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return json({ count: items.length, items });
}
