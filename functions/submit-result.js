import { calculateResult, jsonResponse, normalizeName } from './_lib.js';

export async function onRequest(context) {
  if (context.request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  try {
    const body = await context.request.json().catch(() => ({}));
    const name = normalizeName(body.name);
    if (!name || name.length < 1) return jsonResponse({ error: 'اسم الطالب غير صالح.' }, 400);
    const result = calculateResult(body.answers);
    const createdAtMs = Date.now();
    const id = `${createdAtMs}-${crypto.randomUUID()}`;
    const timestamp = new Date(createdAtMs).toLocaleString('ar-EG', {
      timeZone: 'Africa/Cairo', dateStyle: 'medium', timeStyle: 'short'
    });
    await context.env.DB.prepare(`
      INSERT INTO results (id, name, created_at_ms, timestamp, score, total, percentage, answers_json, mistake_ids_json)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
    `).bind(
      id, name, createdAtMs, timestamp, result.score, result.total,
      result.percentage, JSON.stringify(result.answers), JSON.stringify(result.mistakeIds)
    ).run();
    return jsonResponse({ ok: true, id, score: result.score, total: result.total, percentage: result.percentage });
  } catch (error) {
    console.error('submit-result error:', error);
    return jsonResponse({ error: 'تعذر حفظ النتيجة في السحابة.' }, 500);
  }
}
