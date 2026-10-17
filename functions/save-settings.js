import { jsonResponse, validTeacherPassword } from './_lib.js';

export async function onRequest(context) {
  if (context.request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  const body = await context.request.json().catch(() => ({}));
  if (!validTeacherPassword(body.password, context.env)) {
    return jsonResponse({ ok: false, error: 'كلمة المرور غير صحيحة أو لم يتم إعداد السر TEACHER_PASSWORD.' }, 401);
  }
  const threshold = Number(body.threshold);
  if (!Number.isFinite(threshold) || threshold < 50 || threshold > 100) {
    return jsonResponse({ error: 'نسبة الشهادة يجب أن تكون بين 50 و100.' }, 400);
  }
  try {
    const value = Math.round(threshold);
    await context.env.DB.prepare(`
      INSERT INTO settings (key, value) VALUES ('cert_threshold', ?1)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).bind(value).run();
    return jsonResponse({ ok: true, threshold: value });
  } catch (error) {
    console.error('save-settings error:', error);
    return jsonResponse({ error: 'تعذر حفظ إعداد نسبة الشهادة.' }, 500);
  }
}
