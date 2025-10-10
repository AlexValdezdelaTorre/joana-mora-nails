// netlify/functions/redeem_reward.js
import { createClient } from '@supabase/supabase-js';

const J = (s, b) => ({
  statusCode: s,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(b)
});

export async function handler(event){
  try{
    if (event.httpMethod !== 'POST') return J(405, { ok:false, msg:'Método no permitido' });

    const { id, pin, need } = JSON.parse(event.body || '{}');
    const needInt = Number(need);

    if (!id || !pin || !needInt) return J(400, { ok:false, where:'validate', msg:'Falta id, pin o need' });
    if (![5,10].includes(needInt)) return J(400, { ok:false, where:'need', msg:'Recompensa inválida' });

    const envPin = (process.env.ADMIN_PIN ?? '').toString().trim();
    if (!envPin) return J(500, { ok:false, where:'env', msg:'ADMIN_PIN no definido (revisa .env y reinicia "netlify dev")' });
    if (pin.trim() !== envPin) return J(401, { ok:false, where:'pin', msg:'PIN inválido' });

    const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY)
      return J(500, { ok:false, where:'env', msg:'Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY' });

    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 1) Lee sellos actuales
    const { data: row, error: selErr } = await sb
      .from('customers')
      .select('stamps')
      .eq('id', id)
      .single();
    if (selErr || !row) return J(404, { ok:false, where:'select', error: selErr?.message || 'No existe cliente' });

    const before = Number(row.stamps || 0);
    if (before < needInt) return J(409, { ok:false, where:'eligibility', msg:`No alcanza: tiene ${before}, necesita ${needInt}` });

    // 2) Descuenta
    const after = before - needInt;

    const { data: upd, error: updErr, status } = await sb
      .from('customers')
      .update({ stamps: after })
      .eq('id', id)
      .select('*');
    if (updErr) return J(status || 500, { ok:false, where:'update', error: updErr?.message || updErr });

    // 3) (Opcional) Log de canje
    try {
      await sb.from('redemptions').insert({
        customer_id: id,
        need: needInt,
        before,
        after
      });
    } catch (_) { /* no rompemos si falla el log */ }

    return J(200, { ok:true, where:'redeem', need: needInt, before, after, data: upd });
  } catch (e) {
    return J(500, { ok:false, where:'catch', error: e.message });
  }
}
