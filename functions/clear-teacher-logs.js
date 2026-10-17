import { jsonResponse, validTeacherPassword } from './_lib.js';

export async function onRequest(context) {
  if (context.request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  const body = await context.request.json().catch(() => ({}));
  if (!validTeacherPassword(body.password, context.env)) {
    return jsonResponse({ ok: false, error: 'كلمة المرور غير صحيحة أو لم يتم إعداد السر TEACHER_PASSWORD.' }, 401);
  }
  try {
    await context.env.DB.prepare('DELETE FROM results').run();
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error('clear-teacher-logs error:', error);
    return jsonResponse({ error: 'تعذر حذف سجل الطلاب.' }, 500);
  }
}
