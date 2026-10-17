import { getThreshold, jsonResponse } from './_lib.js';

export async function onRequest(context) {
  if (!['GET', 'POST'].includes(context.request.method)) return jsonResponse({ error: 'Method not allowed' }, 405);
  try {
    const threshold = await getThreshold(context.env);
    return jsonResponse({ ok: true, threshold });
  } catch (error) {
    console.error('get-config error:', error);
    return jsonResponse({ ok: true, threshold: 95 });
  }
}
