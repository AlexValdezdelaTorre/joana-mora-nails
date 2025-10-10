// netlify/functions/stamp.js
import { createClient } from '@supabase/supabase-js';

const J = (s, b) => ({ statusCode: s, headers:{'Content-Type':'application/json'}, body: JSON.stringify(b) });

export async function handler(event) {
  // Salud rápida (GET) – no suma, solo verifica env
  if (event.httpMethod === 'GET' && new URLSearchParams(event.rawQuery).get('health') === '1') {
    return J(200, {
      ok: true,
      where: 'health',
      hasUrl: !!process.env.SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SERVICE_KEY,
      pinSet: !!process.env.ADMIN_PIN
    });
  }

  try {
    if (event.httpMethod !== 'POST') return J(405, { ok:false, where:'method', msg:'Método no permitido' });

    const body = JSON.parse(event.body || '{}');
    const id  = (body.id || '').trim();
    const pin = (body.pin || '').trim();
    const inc = Number(body.inc ?? 1);

    if (!id || !pin) return J(400, { ok:false, where:'validate', msg:'Falta id o pin' });

    const envPin = (process.env.ADMIN_PIN ?? '').toString().trim();
    if (!envPin) return J(500, { ok:false, where:'env', msg:'ADMIN_PIN no definido (revisa .env y reinicia "netlify dev")' });
    if (pin !== envPin) return J(401, { ok:false, where:'pin', msg:'PIN inválido' });

    const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return J(500, { ok:false, where:'env', msg:'Faltan env vars' });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // leer
    const { data: row, error: selErr } = await supabase
      .from('customers')
      .select('stamps')
      .eq('id', id)
      .single();

    if (selErr || !row) return J(404, { ok:false, where:'select', error: selErr, id });

    // actualizar
    const nuevo = Number(row.stamps || 0) + inc;

    const { data, error: updErr, status } = await supabase
      .from('customers')
      .update({ stamps: nuevo })
      .eq('id', id)
      .select('*');

    if (updErr) return J(status || 500, { ok:false, where:'update', error: updErr });

    return J(200, { ok:true, where:'post', before: row.stamps, after: data?.[0]?.stamps, data });
  } catch (e) {
    return J(500, { ok:false, where:'catch', error: e.message });
  }
}
