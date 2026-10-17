import { buildDashboard, getThreshold, jsonResponse, validTeacherPassword } from './_lib.js';

export async function onRequest(context) {
  if (context.request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  const body = await context.request.json().catch(() => ({}));
  if (!validTeacherPassword(body.password, context.env)) {
    return jsonResponse({ ok: false, error: 'كلمة المرور غير صحيحة أو لم يتم إعداد السر TEACHER_PASSWORD.' }, 401);
  }
  try {
    const result = await context.env.DB.prepare(`
      SELECT id, name, timestamp, created_at_ms, score, total, percentage, mistake_ids_json
      FROM results ORDER BY created_at_ms DESC
    `).all();
    const threshold = await getThreshold(context.env);
    return jsonResponse({ ok: true, ...buildDashboard(result.results || [], threshold) });
  } catch (error) {
    console.error('teacher-dashboard error:', error);
    return jsonResponse({ error: 'تعذر تحميل سجل الطلاب من قاعدة D1.' }, 500);
  }
}
