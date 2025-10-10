
// netlify/functions/create_customer.js
import { createClient } from '@supabase/supabase-js';

const J = (s, b) => ({
  statusCode: s,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(b),
});

export async function handler(event) {
  try {
    if (event.httpMethod !== 'POST') return J(405, { ok:false, msg:'Método no permitido' });

    const { name = '', phone = '' } = JSON.parse(event.body || '{}');
    const cleanName  = String(name).trim().slice(0, 60);
    const cleanPhone = String(phone).replace(/\D+/g,'').slice(-15); // solo dígitos

    if (!cleanName || !cleanPhone) return J(400, { ok:false, msg:'Falta nombre o teléfono' });

    const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return J(500, { ok:false, msg:'Faltan env vars' });

    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Reutiliza si el teléfono ya existe
    const { data: found, error: selErr } = await sb
      .from('customers')
      .select('id,name,phone,stamps')
      .eq('phone', cleanPhone)
      .maybeSingle();
    if (selErr) return J(500, { ok:false, where:'select', error: selErr.message });
    if (found)  return J(200, { ok:true, created:false, data: found });

    // Crea nuevo
    const { data: created, error: insErr, status } = await sb
      .from('customers')
      .insert({ name: cleanName, phone: cleanPhone, stamps: 0 })
      .select('id,name,phone,stamps')
      .single();
    if (insErr) return J(status || 500, { ok:false, where:'insert', error: insErr.message });

    return J(200, { ok:true, created:true, data: created });
  } catch (e) {
    return J(500, { ok:false, where:'catch', error: e.message });
  }
}
