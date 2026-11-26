import { demos, services } from '../content.mjs';

export function validate(body) {
  if (!body || body.consent !== '1') return null;
  const limits = {name:100,business:150,email:254,whatsapp:24,sector:100,website:300,service:120,description:2000};
  const lead = {};
  for (const [key, max] of Object.entries(limits)) {
    const value = typeof body[key] === 'string' ? body[key].trim() : '';
    if (value.length > max || (!value && key !== 'website')) return null;
    lead[key] = value;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return null;
  if (!/^\+?[\d(). -]{7,24}$/.test(lead.whatsapp) || lead.whatsapp.replace(/\D/g,'').length < 7) return null;
  if (!['Otro', ...demos.map(demo => demo.name)].includes(lead.sector)) return null;
  if (!services.some(([name]) => name === lead.service)) return null;
  if (lead.website && !['https:', 'http:'].includes(URL.parse(lead.website)?.protocol)) return null;
  return {...lead, consentVersion:'1', receivedAt:new Date().toISOString()};
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const url = URL.parse(process.env.LEADS_WEBHOOK_URL ?? '');
  const token = process.env.LEADS_WEBHOOK_TOKEN;
  const available = url?.protocol === 'https:' && Boolean(token && process.env.ONLAINE_PRIVACY_READY === 'true');
  if (req.method === 'GET') return res.status(200).json({available});
  if (req.method !== 'POST') return res.status(405).json({ok:false});
  if (!available) return res.status(503).json({ok:false});
  if (URL.parse(req.headers.origin ?? '')?.host !== req.headers.host) return res.status(403).json({ok:false});
  if (!req.headers['content-type']?.startsWith('application/json')) return res.status(415).json({ok:false});
  const lead = validate(req.body);
  if (!lead) return res.status(400).json({ok:false});
  try {
    const delivery = await fetch(url, {
      method:'POST', redirect:'error', signal:AbortSignal.timeout(8000),
      headers:{'Content-Type':'application/json', Authorization:'Bearer ' + token}, body:JSON.stringify(lead),
    });
    if (!delivery.ok) return res.status(502).json({ok:false});
    return res.status(201).json({ok:true});
  } catch {
    return res.status(502).json({ok:false});
  }
}
